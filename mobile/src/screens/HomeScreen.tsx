import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';

import { Screen } from '../components/Screen';
import { chapterSummaries } from '../data/questions';
import { useQuiz } from '../providers/QuizProvider';
import { colors, radii, shadows, spacing } from '../theme/tokens';
import type { RootStackParamList } from '../types/navigation';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export function HomeScreen() {
  const navigation = useNavigation<NavigationProp>();
  const quiz = useQuiz();

  return (
    <Screen contentContainerStyle={styles.screenContent}>
      <Animated.View entering={FadeInDown.duration(220)} style={styles.topBar}>
        <Text style={styles.cityText}>北京</Text>
        <View style={styles.searchBar}>
          <Ionicons name="search-outline" size={16} color="#98A2B3" />
          <Text style={styles.searchText}>4步轻松学科一四</Text>
        </View>
        <Pressable style={styles.shortcutButton}>
          <Ionicons name="scan-outline" size={18} color="#6BD6C9" />
        </Pressable>
      </Animated.View>

      <View style={styles.subjectTabs}>
        {['科一', '科二', '科三', '科四', '新司机'].map((item, index) => (
          <View key={item} style={styles.subjectItem}>
            <Text style={[styles.subjectText, index === 0 ? styles.subjectTextActive : null]}>{item}</Text>
            {index === 0 ? <View style={styles.subjectIndicator} /> : null}
          </View>
        ))}
      </View>

      <Animated.View entering={FadeInDown.delay(60).duration(220)} style={styles.banner}>
        <View style={styles.bannerPoster} />
        <View style={styles.bannerContent}>
          <Text style={styles.bannerTitle}>胶囊空间站蒸汽质感搬来考试首页</Text>
          <Text style={styles.bannerMeta}>轻内容位，用来承接课程、直播或活动运营</Text>
        </View>
      </Animated.View>

      <Animated.View entering={FadeInDown.delay(100).duration(220)} style={styles.quickBoard}>
        <View style={styles.quickColumn}>
          <MiniCard label="VIP课程" color="#FFE49F" icon="diamond-outline" />
          <MiniCard label="直播课" color="#90F0DA" icon="videocam-outline" />
          <MiniCard label="答题技巧" color="#70E8C4" icon="bulb-outline" />
          <MiniCard label="错题·收藏" color="#FFC27B" icon="close-outline" />
        </View>

        <View style={[styles.quickColumn, styles.centerColumn]}>
          <FeatureCard
            title="顺序练习"
            subtitle={`${quiz.continueIndex + 1}/1678`}
            tint="#BFF7E7"
            icon="document-text-outline"
            onPress={() =>
              navigation.navigate('PracticeQuestion', {
                startIndex: quiz.continueIndex,
                title: '顺序练习',
              })
            }
          />
          <FeatureCard title="模拟考试" subtitle="0 分" tint="#CDEEFF" icon="reader-outline" onPress={() => (navigation as any).navigate('MockExam')} />
        </View>

        <View style={styles.quickColumn}>
          <MiniCard label="精选500题" color="#C9D0FF" icon="star-outline" />
          <MiniCard label="分阶段练题" color="#9AD9FF" icon="stats-chart-outline" />
          <MiniCard label="真实考场模拟" color="#92ECB9" icon="checkbox-outline" />
          <MiniCard label="专项练习" color="#9EDAFF" icon="albums-outline" />
        </View>
      </Animated.View>

      <Animated.View entering={FadeInDown.delay(140).duration(220)} style={styles.sectionCard}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>章节练习</Text>
          <Text style={styles.sectionAction}>更多</Text>
        </View>
        {chapterSummaries.slice(0, 3).map((item) => (
          <Pressable
            key={item.chapter}
            style={styles.chapterRow}
            onPress={() =>
              navigation.navigate('PracticeQuestion', {
                startIndex: item.firstIndex,
                chapter: item.chapter,
                title: item.title,
              })
            }>
            <View style={styles.chapterTag} />
            <View style={styles.chapterCopy}>
              <Text style={styles.chapterTitle}>{item.title}</Text>
              <Text style={styles.chapterMeta}>{item.total} 题 · 高频考点持续练</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color={colors.textMuted} />
          </Pressable>
        ))}
      </Animated.View>
    </Screen>
  );
}

function FeatureCard({ title, subtitle, tint, icon, onPress }: { title: string; subtitle: string; tint: string; icon: keyof typeof Ionicons.glyphMap; onPress: () => void }) {
  return (
    <Pressable onPress={onPress} style={[styles.featureCard, { backgroundColor: tint }]}>
      <View style={styles.featureIconWrap}>
        <Ionicons name={icon} size={28} color="#FFFFFF" />
      </View>
      <Text style={styles.featureTitle}>{title}</Text>
      <Text style={styles.featureSubtitle}>{subtitle}</Text>
    </Pressable>
  );
}

function MiniCard({ label, color, icon }: { label: string; color: string; icon: keyof typeof Ionicons.glyphMap }) {
  return (
    <View style={styles.miniCard}>
      <View style={[styles.miniIcon, { backgroundColor: color }]}>
        <Ionicons name={icon} size={20} color="#FFFFFF" />
      </View>
      <Text style={styles.miniLabel}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  screenContent: {
    paddingTop: spacing.sm,
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  cityText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
  searchBar: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#F4F7FA',
    borderRadius: radii.pill,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  searchText: {
    fontSize: 13,
    color: '#98A2B3',
  },
  shortcutButton: {
    width: 36,
    height: 36,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F2FBFA',
  },
  subjectTabs: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: spacing.sm,
  },
  subjectItem: {
    alignItems: 'center',
    gap: 8,
  },
  subjectText: {
    fontSize: 16,
    color: colors.textMuted,
    fontWeight: '500',
  },
  subjectTextActive: {
    color: colors.text,
    fontWeight: '700',
  },
  subjectIndicator: {
    width: 22,
    height: 3,
    borderRadius: radii.pill,
    backgroundColor: '#49D7C9',
  },
  banner: {
    marginTop: spacing.sm,
    borderRadius: 16,
    backgroundColor: '#2E3440',
    overflow: 'hidden',
    flexDirection: 'row',
  },
  bannerPoster: {
    width: 92,
    backgroundColor: '#27303B',
  },
  bannerContent: {
    flex: 1,
    padding: spacing.md,
    justifyContent: 'center',
    gap: 6,
  },
  bannerTitle: {
    color: '#FFFFFF',
    fontSize: 16,
    lineHeight: 22,
    fontWeight: '700',
  },
  bannerMeta: {
    color: '#CDD5DF',
    fontSize: 12,
  },
  quickBoard: {
    marginTop: spacing.md,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    height: 420,
  },
  quickColumn: {
    width: '31.5%',
    height: '100%',
    gap: spacing.md,
    alignItems: 'center',
  },
  centerColumn: {
    justifyContent: 'space-between',
    paddingVertical: spacing.lg,
  },
  featureCard: {
    width: '100%',
    minHeight: 134,
    borderRadius: 22,
    padding: spacing.md,
    justifyContent: 'space-between',
    ...shadows.card,
  },
  featureIconWrap: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: 'rgba(255,255,255,0.28)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  featureTitle: {
    fontSize: 20,
    lineHeight: 26,
    color: '#216567',
    fontWeight: '700',
  },
  featureSubtitle: {
    fontSize: 14,
    color: '#4C7E82',
  },
  miniCard: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'flex-start',
    gap: spacing.sm,
    paddingTop: 6,
    minHeight: 84,
  },
  miniIcon: {
    width: 44,
    height: 44,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.card,
  },
  miniLabel: {
    fontSize: 14,
    color: colors.text,
    textAlign: 'center',
    lineHeight: 20,
  },
  sectionCard: {
    marginTop: spacing.md,
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: '#EEF2F7',
    ...shadows.card,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text,
  },
  sectionAction: {
    fontSize: 14,
    color: colors.textMuted,
  },
  chapterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingVertical: 12,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: '#EEF2F7',
  },
  chapterTag: {
    width: 10,
    height: 10,
    borderRadius: radii.pill,
    backgroundColor: '#49D7C9',
  },
  chapterCopy: {
    flex: 1,
  },
  chapterTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
  },
  chapterMeta: {
    marginTop: 4,
    fontSize: 13,
    color: colors.textMuted,
  },
});
