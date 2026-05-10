# Clean Architecture Rules

이 프로젝트는 유지보수성과 확장성을 위해 **클린 아키텍처(Clean Architecture)** 디자인 패턴을 따릅니다. 모든 코드는 관심사에 따라 레이어별로 분리되며, 의존성은 항상 내부(도메인) 방향으로만 향해야 합니다.

## 1. 폴더 구조 및 역할 (Folder Structure & Roles)

### `src/domain` (Domain Layer)
가장 핵심이 되는 계층으로 외부 환경에 의존하지 않습니다.
- `entities/`: 비즈니스 데이터 모델 및 핵심 규칙 (Interface, Types)
- `repositories/`: 데이터 처리를 위한 인터페이스 정의

### `src/application` (Application Layer)
사용자의 요청에 기초한 비즈니스 시나리오를 구현합니다.
- `use-cases/`: 구체적인 비즈니스 로직 구현 (예: CreateOrder, GetProduct)
- `dtos/`: 레이어 간 데이터 전달을 위한 타입 정의

### `src/infrastructure` (Infrastructure Layer)
외부 기술 및 상세 구현을 담당합니다.
- `repositories/`: 도메인 인터페이스의 실제 구현 (e.g., Supabase 연동, API 호출)
- `data-sources/`: 외부 SDK 설정 및 API 클라이언트 (Axios, Fetch 설정 등)

### `src/presentation` (Presentation Layer)
UI와 사용자 경험을 담당합니다.
- `components/`: UI 컴포넌트 (Shadcn UI 등)
- `hooks/`: UI 전용 커스텀 훅 및 상태 관리 (Zustand 등)
- `styles/`: 디자인 토큰 및 CSS

### `app` (Next.js App Router)
실제 라우팅과 페이지 구성을 관리하며 Presentation 레이어의 진입점 역할을 합니다.

## 2. 의존성 규칙 (Dependency Rule)
- 하위 레이어는 상위 레이어를 알 수 없습니다.
- 예: `Domain`은 `Infrastructure`나 `Presentation`에 직접 의존해서는 안 됩니다.
- 모든 데이터의 흐름은 `Presentation` -> `Application` -> `Domain` 순으로 일어납니다.

## 3. 경로 별칭 (Path Aliases)
임포트 가독성을 위해 `tsconfig.json`에 다음 별칭을 사용하도록 설정되었습니다:
- `@domain/*`: `src/domain/*`
- `@application/*`: `src/application/*`
- `@infrastructure/*`: `src/infrastructure/*`
- `@presentation/*`: `src/presentation/*`

## 4. 코딩 가이드라인 (Coding Guidelines)
- 모든 파일은 한국어 주석을 포함할 것.
- 기술적 용어는 영어를 병기하되 설명은 한국어로 상세히 할 것.
- 새로운 파일 생성 시 해당 레이어의 역할에 맞는지 확인 후 위치시킬 것.
