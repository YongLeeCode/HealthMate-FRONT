# 🏋️ HealthMate - 개인 맞춤형 운동 추천 앱

HealthMate는 사용자의 선호도와 운동 기록을 기반으로 개인화된 운동을 추천하고, 실시간 타이머로 운동을 도와주는 React Native 앱입니다.

## 📱 주요 기능

### 🆕 첫 사용자 플로우
1. **메인 화면** - 환영 메시지와 "시작하기" 버튼
2. **근육 그룹 선택** - 가슴, 등, 어깨, 팔, 다리, 코어, 전신 중 선택
3. **난이도 선택** - 초급, 중급, 고급
4. **운동 시간 설정** - 프리셋 또는 커스텀 설정 (10-120분)
5. **운동 장소 선택** - 집, 헬스장, 야외, 사무실
6. **운동 커리큘럼** - 조건에 맞는 운동 생성 및 편집
7. **운동 타이머** - 개별 운동 타이머, 진행률, 스킵/완료 기능
8. **운동 완료** - 난이도 평가 (1-5점) 및 노트 작성
9. **저장** - 로컬 스토리지에 운동 기록 저장

### 🔄 기존 사용자 플로우
1. **메인 화면** - 오늘의 추천 운동과 최근 운동 기록
2. **운동 설정** - 추천 운동 또는 커스텀 옵션
3. **운동 타이머** - 동일한 타이머 기능
4. **운동 완료** - 동일한 평가 및 저장

## 🏗️ 프로젝트 구조

```
mobile/
├── app/                          # Expo Router 앱 구조
│   ├── (tabs)/                   # 탭 네비게이션
│   │   ├── _layout.tsx          # 탭 레이아웃
│   │   ├── home.tsx             # 메인 홈 화면
│   │   └── two.tsx              # 기존 탭 (미사용)
│   ├── muscle-selection.tsx      # 근육 그룹 선택
│   ├── difficulty-selection.tsx  # 난이도 선택
│   ├── duration-config.tsx      # 운동 시간 설정
│   ├── location-selection.tsx   # 운동 장소 선택
│   ├── workout-curriculum.tsx   # 운동 커리큘럼
│   ├── workout-timer.tsx        # 운동 타이머
│   ├── workout-completion.tsx   # 운동 완료
│   ├── workout-setup.tsx        # 기존 사용자 설정
│   └── timer.tsx                # 기존 타이머 (미사용)
├── components/                   # 재사용 가능한 컴포넌트
│   ├── Themed.tsx               # 테마 컴포넌트
│   └── ...
├── constants/                    # 상수 정의
│   └── Colors.ts                # 색상 테마
├── data/                        # 데이터베이스
│   └── exercises.ts             # 운동 데이터 (12개 운동)
├── services/                    # API 및 서비스
│   └── api.ts                   # 로컬 스토리지 및 API 통신
├── types/                       # TypeScript 타입 정의
│   └── workout.ts               # 운동 관련 타입
├── utils/                       # 유틸리티 함수
│   └── workouts.ts              # 운동 추천 로직
└── assets/                      # 이미지 및 폰트
```

## 🎯 핵심 기능

### 📊 개인화된 운동 추천
- 사용자의 운동 기록 분석
- 선호하는 근육 그룹, 난이도, 장소 기반 추천
- 시간대별 난이도 조정 (저녁에는 낮은 강도)

### ⏱️ 실시간 운동 타이머
- 개별 운동별 타이머
- 운동/휴식 시간 자동 전환
- 진행률 표시
- 운동 스킵/완료 기능

### 💾 데이터 관리
- AsyncStorage를 통한 로컬 데이터 저장
- 백엔드 API 연동 준비
- 사용자 선호도 및 운동 기록 저장

### 🎨 사용자 경험
- 직관적인 UI/UX
- 다크/라이트 테마 지원
- 반응형 디자인
- 부드러운 화면 전환

## 🏃‍♂️ 운동 데이터베이스

### 근육 그룹별 운동
- **가슴**: Push-ups, Diamond Push-ups
- **등**: Superman, Pull-ups
- **어깨**: Pike Push-ups
- **팔**: Tricep Dips
- **다리**: Bodyweight Squats, Walking Lunges
- **코어**: Plank, Crunches
- **전신**: Burpees, Mountain Climbers

### 난이도별 분류
- **초급**: 기본 동작, 긴 휴식 시간
- **중급**: 변형 동작, 적당한 휴식 시간
- **고급**: 복합 동작, 짧은 휴식 시간

## 🛠️ 기술 스택

### 프레임워크 & 라이브러리
- **React Native** - 크로스 플랫폼 모바일 앱
- **Expo** - 개발 도구 및 서비스
- **Expo Router** - 파일 기반 라우팅
- **TypeScript** - 타입 안전성

### 상태 관리 & 데이터
- **AsyncStorage** - 로컬 데이터 저장
- **React Hooks** - 상태 관리
- **Context API** - 전역 상태

### UI & 스타일링
- **React Native StyleSheet** - 스타일링
- **Expo Vector Icons** - 아이콘
- **React Native Pressable** - 터치 인터랙션

## 🚀 설치 및 실행

### 필수 요구사항
- Node.js 18+
- npm 또는 yarn
- Expo CLI
- iOS Simulator 또는 Android Emulator

### 설치
```bash
# 의존성 설치
npm install

# 개발 서버 시작
npm start

# iOS 시뮬레이터에서 실행
npm run ios

# Android 에뮬레이터에서 실행
npm run android

# 웹에서 실행
npm run web
```

### 추가 의존성
```bash
npm install @react-native-async-storage/async-storage expo-image-picker expo-av expo-haptics
```

## 📱 화면별 상세 설명

### 1. 메인 화면 (`home.tsx`)
- 첫 사용자: 환영 메시지와 "시작하기" 버튼
- 기존 사용자: 오늘의 추천 운동, 최근 운동 기록, 빠른 액션

### 2. 근육 그룹 선택 (`muscle-selection.tsx`)
- 7개 근육 그룹 중 다중 선택 가능
- 각 그룹별 설명과 아이콘 제공

### 3. 난이도 선택 (`difficulty-selection.tsx`)
- 초급/중급/고급 난이도 선택
- 각 난이도별 상세 설명

### 4. 운동 시간 설정 (`duration-config.tsx`)
- 프리셋: Quick(15분), Standard(30분), Extended(45분), Intensive(60분)
- 커스텀: 운동 시간 및 휴식 시간 조정

### 5. 운동 장소 선택 (`location-selection.tsx`)
- 집, 헬스장, 야외, 사무실 중 선택
- 장소별 장점 설명

### 6. 운동 커리큘럼 (`workout-curriculum.tsx`)
- 조건에 맞는 운동 자동 생성
- 운동 제거/편집 기능
- 총 운동 시간 계산

### 7. 운동 타이머 (`workout-timer.tsx`)
- 실시간 카운트다운 타이머
- 운동/휴식 자동 전환
- 진행률 표시
- 스킵/완료 기능

### 8. 운동 완료 (`workout-completion.tsx`)
- 운동 통계 표시
- 난이도 평가 (1-5점)
- 노트 작성 기능
- 데이터 저장

## 🔧 API 구조

### 로컬 스토리지 키
```typescript
const STORAGE_KEYS = {
  USER_PREFERENCES: 'user_preferences',
  WORKOUT_SESSIONS: 'workout_sessions',
  USER_ID: 'user_id',
  IS_FIRST_TIME: 'is_first_time',
}
```

### 주요 서비스
- `workoutService` - 운동 세션 관리
- `userService` - 사용자 선호도 관리
- `recommendationService` - 운동 추천 로직

## 🎨 디자인 시스템

### 색상 팔레트
- **Primary**: #007AFF (iOS Blue)
- **Success**: #34C759 (Green)
- **Warning**: #FF9500 (Orange)
- **Error**: #FF3B30 (Red)

### 타이포그래피
- **Title**: 24-28px, Bold
- **Subtitle**: 16-18px, Regular
- **Body**: 14-16px, Regular
- **Caption**: 12-14px, Regular

## 🔮 향후 개발 계획

### 단기 목표
- [ ] 음성/진동 알림 기능
- [ ] 운동 통계 및 차트
- [ ] 사용자 프로필 설정
- [ ] 백그라운드 타이머 유지

### 중기 목표
- [ ] 음악 연동
- [ ] 푸시 알림
- [ ] 소셜 공유
- [ ] 운동 영상 가이드

### 장기 목표
- [ ] AI 기반 운동 추천
- [ ] 커뮤니티 기능
- [ ] 웨어러블 기기 연동
- [ ] 다국어 지원

## 🤝 기여하기

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 라이선스

이 프로젝트는 MIT 라이선스 하에 배포됩니다.

## 👨‍💻 개발자

HealthMate는 개인 맞춤형 운동 경험을 제공하기 위해 개발되었습니다.

---

**HealthMate** - 당신만을 위한 운동 파트너 💪
