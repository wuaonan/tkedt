#!/usr/bin/env python3
import argparse
import csv
import json
import os
import re
import ssl
import sys
import time
from pathlib import Path
from typing import Any
from urllib.error import HTTPError, URLError
from urllib.parse import urlencode
from urllib.request import Request, urlopen


BASE_URL = "https://mnks.jxedt.com/get_question"
DEFAULT_REFERER = "https://mnks.jxedt.com/ckm1/sxlx/"
DEFAULT_PAGE_URL = DEFAULT_REFERER


def build_headers(cookie: str, referer: str) -> dict[str, str]:
    headers = {
        "Accept": "*/*",
        "Accept-Language": "zh-CN,zh;q=0.9",
        "Referer": referer,
        "User-Agent": (
            "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) "
            "AppleWebKit/537.36 (KHTML, like Gecko) "
            "Chrome/146.0.0.0 Safari/537.36"
        ),
        "X-Requested-With": "XMLHttpRequest",
    }
    if cookie:
        headers["Cookie"] = cookie
    return headers


def fetch_question(
    index: int,
    headers: dict[str, str],
    timeout: float,
    insecure: bool,
) -> dict[str, Any]:
    url = f"{BASE_URL}?{urlencode({'index': index})}"
    request = Request(url, headers=headers)
    context = None
    if insecure:
        context = ssl._create_unverified_context()
    with urlopen(request, timeout=timeout, context=context) as response:
        payload = response.read().decode("utf-8")
    return json.loads(payload or "{}")


def fetch_text(url: str, headers: dict[str, str], timeout: float, insecure: bool) -> str:
    request = Request(url, headers=headers)
    context = None
    if insecure:
        context = ssl._create_unverified_context()
    with urlopen(request, timeout=timeout, context=context) as response:
        return response.read().decode("utf-8")


def extract_page_question_ids(html: str) -> list[int]:
    ids = [int(value) for value in re.findall(r'<li\s+data-id="(\d+)"', html)]
    seen: set[int] = set()
    ordered_ids: list[int] = []
    for item in ids:
        if item not in seen:
            seen.add(item)
            ordered_ids.append(item)
    return ordered_ids


def normalize_record(raw: dict[str, Any], requested_index: int) -> dict[str, Any]:
    options = []
    for key in ("a", "b", "c", "d", "e", "f", "g"):
        value = (raw.get(key) or "").strip()
        if value:
            options.append(value)

    return {
        "requested_index": requested_index,
        "id": raw.get("id"),
        "question": raw.get("question", ""),
        "type": raw.get("type"),
        "chapter": raw.get("chapter"),
        "right": raw.get("right"),
        "ta": raw.get("ta"),
        "options_text": raw.get("options", ""),
        "options": options,
        "imageurl": raw.get("imageurl", ""),
        "sohuimg": raw.get("sohuimg", ""),
        "bestanswer": raw.get("bestanswer", ""),
    }


def write_json(path: Path, records: list[dict[str, Any]]) -> None:
    path.write_text(json.dumps(records, ensure_ascii=False, indent=2), encoding="utf-8")


def write_csv(path: Path, records: list[dict[str, Any]]) -> None:
    fieldnames = [
        "requested_index",
        "id",
        "question",
        "type",
        "chapter",
        "right",
        "ta",
        "options_text",
        "option_a",
        "option_b",
        "option_c",
        "option_d",
        "option_e",
        "option_f",
        "option_g",
        "imageurl",
        "sohuimg",
        "bestanswer",
    ]

    with path.open("w", newline="", encoding="utf-8-sig") as handle:
        writer = csv.DictWriter(handle, fieldnames=fieldnames)
        writer.writeheader()
        for record in records:
            options = record["options"] + [""] * 7
            writer.writerow(
                {
                    "requested_index": record["requested_index"],
                    "id": record["id"],
                    "question": record["question"],
                    "type": record["type"],
                    "chapter": record["chapter"],
                    "right": record["right"],
                    "ta": record["ta"],
                    "options_text": record["options_text"],
                    "option_a": options[0],
                    "option_b": options[1],
                    "option_c": options[2],
                    "option_d": options[3],
                    "option_e": options[4],
                    "option_f": options[5],
                    "option_g": options[6],
                    "imageurl": record["imageurl"],
                    "sohuimg": record["sohuimg"],
                    "bestanswer": record["bestanswer"],
                }
            )


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description="抓取驾校一点通题库接口并导出 JSON/CSV。")
    parser.add_argument("--start", type=int, default=1, help="起始 index，默认 1")
    parser.add_argument("--end", type=int, default=1639, help="结束 index，默认 1639")
    parser.add_argument(
        "--mode",
        choices=("range", "page-ids"),
        default="range",
        help="range=按 index 区间抓取；page-ids=先从练习页提取 data-id 再抓取",
    )
    parser.add_argument(
        "--page-url",
        default=os.environ.get("JXEDT_PAGE_URL", DEFAULT_PAGE_URL),
        help=f"练习页地址，默认 {DEFAULT_PAGE_URL}",
    )
    parser.add_argument(
        "--cookie",
        default=os.environ.get("JXEDT_COOKIE", ""),
        help="请求 Cookie，默认读取环境变量 JXEDT_COOKIE",
    )
    parser.add_argument(
        "--referer",
        default=os.environ.get("JXEDT_REFERER", DEFAULT_REFERER),
        help=f"Referer，默认 {DEFAULT_REFERER}",
    )
    parser.add_argument("--delay", type=float, default=0.15, help="每次请求间隔秒数，默认 0.15")
    parser.add_argument("--timeout", type=float, default=15.0, help="单次请求超时秒数，默认 15")
    parser.add_argument(
        "--insecure",
        action="store_true",
        help="跳过 TLS 证书校验，仅在本机证书链异常时使用",
    )
    parser.add_argument(
        "--max-empty-streak",
        type=int,
        default=30,
        help="连续空结果达到该值时提前停止，默认 30",
    )
    parser.add_argument(
        "--json-output",
        default="jxedt_questions.json",
        help="JSON 输出文件路径，默认 jxedt_questions.json",
    )
    parser.add_argument(
        "--csv-output",
        default="jxedt_questions.csv",
        help="CSV 输出文件路径，默认 jxedt_questions.csv",
    )
    return parser.parse_args()


def main() -> int:
    args = parse_args()

    if args.start <= 0 or args.end < args.start:
        print("参数错误：请保证 start > 0 且 end >= start。", file=sys.stderr)
        return 2

    headers = build_headers(args.cookie, args.referer)
    records: list[dict[str, Any]] = []
    empty_streak = 0
    if args.mode == "page-ids":
        try:
            html = fetch_text(args.page_url, headers, args.timeout, args.insecure)
        except HTTPError as exc:
            print(f"页面 HTTP 错误: {exc.code}", file=sys.stderr)
            return 1
        except URLError as exc:
            print(f"页面网络错误: {exc.reason}", file=sys.stderr)
            return 1

        fetch_plan = extract_page_question_ids(html)
        if not fetch_plan:
            print("未从页面中提取到任何 data-id。", file=sys.stderr)
            return 1
        fetch_plan = fetch_plan[args.start - 1 : args.end]
        print(f"从页面提取到 {len(fetch_plan)} 个题目 data-id。")
    else:
        fetch_plan = list(range(args.start, args.end + 1))

    for index in fetch_plan:
        try:
            payload = fetch_question(index, headers, args.timeout, args.insecure)
        except HTTPError as exc:
            print(f"[{index}] HTTP 错误: {exc.code}", file=sys.stderr)
            empty_streak += 1
        except URLError as exc:
            print(f"[{index}] 网络错误: {exc.reason}", file=sys.stderr)
            return 1
        except json.JSONDecodeError as exc:
            print(f"[{index}] JSON 解析失败: {exc}", file=sys.stderr)
            empty_streak += 1
        else:
            if payload and payload.get("question"):
                record = normalize_record(payload, index)
                records.append(record)
                empty_streak = 0
                print(f"[{index}] OK -> id={record['id']} {record['question'][:40]}")
            else:
                empty_streak += 1
                print(f"[{index}] empty")

        if empty_streak >= args.max_empty_streak:
            print(f"连续 {empty_streak} 个空结果，提前停止。")
            break

        if args.delay > 0:
            time.sleep(args.delay)

    json_path = Path(args.json_output)
    csv_path = Path(args.csv_output)
    write_json(json_path, records)
    write_csv(csv_path, records)

    print(f"完成：共写入 {len(records)} 条记录。")
    print(f"JSON: {json_path.resolve()}")
    print(f"CSV:  {csv_path.resolve()}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
