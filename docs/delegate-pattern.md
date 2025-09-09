# Delegate Pattern 완전 가이드

**Delegate Pattern**은 객체가 특정 작업을 직접 수행하지 않고 다른 객체에게 **위임(delegate)**하는 디자인 패턴입니다.

## 📖 목차

- [개념 이해](#개념-이해)
- [실생활 비유](#실생활-비유)
- [코드 예시](#코드-예시)
- [핵심 구성 요소](#핵심-구성-요소)
- [실무 활용 예시](#실무-활용-예시)
- [장점과 단점](#장점과-단점)
- [프로젝트 적용 사례](#프로젝트-적용-사례)
- [사용 가이드라인](#사용-가이드라인)

## 개념 이해

Delegate Pattern의 핵심은 **"책임 분리"**입니다. 객체가 모든 일을 직접 처리하지 않고, 특정 작업을 전문화된 다른 객체에게 맡김으로써 **유연성과 재사용성**을 높입니다.

### 기본 구조
```
Client → Delegator → Delegate → Concrete Implementation
```

## 🏢 실생활 비유

### 회사 CEO 예시
```
CEO (위임자)
├─ "재무 보고서 만들어줘" → CFO (재무 담당자)
├─ "마케팅 전략 세워줘" → CMO (마케팅 담당자)  
└─ "기술 검토해줘" → CTO (기술 담당자)
```

CEO는 모든 업무를 직접 수행하지 않고 각 분야의 **전문가에게 위임**합니다. 이를 통해:
- CEO는 전략적 의사결정에 집중
- 각 전문가는 자신의 영역에서 최고 성능 발휘
- 조직의 유연성과 확장성 확보

## 💻 코드 예시

### Before: Delegate Pattern 없이
```typescript
class FileManager {
  saveFile(data: string) {
    // 직접 파일 저장 로직 구현
    console.log("로컬 디스크에 파일 저장:", data);
  }
  
  loadFile(filename: string) {
    // 직접 파일 로드 로직 구현  
    console.log("로컬 디스크에서 파일 로드:", filename);
    return "파일 내용";
  }
}
```

**문제점:**
- 저장 방식 변경 시 FileManager 수정 필요
- 테스트가 어려움 (실제 파일 시스템 의존)
- 다양한 저장 방식 지원 시 코드 복잡도 증가

### After: Delegate Pattern 적용
```typescript
// 1. Delegate 인터페이스 정의
interface StorageDelegate {
  save(data: string): void;
  load(filename: string): string;
}

// 2. 구체적인 Delegate 구현체들
class LocalStorageDelegate implements StorageDelegate {
  save(data: string) {
    console.log("로컬 디스크에 저장:", data);
    // 실제 로컬 저장 로직
  }
  
  load(filename: string) {
    console.log("로컬 디스크에서 로드:", filename);
    return "로컬 파일 내용";
  }
}

class CloudStorageDelegate implements StorageDelegate {
  save(data: string) {
    console.log("클라우드에 저장:", data);
    // 실제 클라우드 저장 로직
  }
  
  load(filename: string) {
    console.log("클라우드에서 로드:", filename);
    return "클라우드 파일 내용";
  }
}

class MemoryStorageDelegate implements StorageDelegate {
  private storage = new Map<string, string>();
  
  save(data: string) {
    this.storage.set("default", data);
    console.log("메모리에 저장:", data);
  }
  
  load(filename: string) {
    return this.storage.get(filename) || "빈 내용";
  }
}

// 3. 위임자 (Delegator)
class FileManager {
  constructor(private storageDelegate: StorageDelegate) {}
  
  saveFile(data: string) {
    // 실제 저장은 delegate에게 위임
    this.storageDelegate.save(data);
  }
  
  loadFile(filename: string) {
    // 실제 로드는 delegate에게 위임
    return this.storageDelegate.load(filename);
  }
  
  // delegate 교체 가능
  setStorageDelegate(delegate: StorageDelegate) {
    this.storageDelegate = delegate;
  }
}

// 4. 사용법
const localManager = new FileManager(new LocalStorageDelegate());
const cloudManager = new FileManager(new CloudStorageDelegate());
const memoryManager = new FileManager(new MemoryStorageDelegate());

localManager.saveFile("로컬 데이터");    // 로컬에 저장
cloudManager.saveFile("클라우드 데이터"); // 클라우드에 저장
memoryManager.saveFile("메모리 데이터");  // 메모리에 저장

// 런타임에 저장 방식 변경
localManager.setStorageDelegate(new CloudStorageDelegate());
localManager.saveFile("이제 클라우드에 저장"); // 클라우드에 저장됨
```

## 🎯 핵심 구성 요소

### 1. Delegator (위임자)
```typescript
class FileManager {
  constructor(private storageDelegate: StorageDelegate) {}
  
  // 실제 작업은 하지 않고 delegate에게 위임만 함
  saveFile(data: string) {
    this.storageDelegate.save(data);
  }
}
```
**역할:** 클라이언트 요청을 받아 적절한 delegate에게 전달

### 2. Delegate Interface (수임자 인터페이스)
```typescript
interface StorageDelegate {
  save(data: string): void;
  load(filename: string): string;
}
```
**역할:** 위임받을 작업들의 계약(contract) 정의

### 3. Concrete Delegate (구체적 수임자)
```typescript
class LocalStorageDelegate implements StorageDelegate {
  save(data: string) {
    // 실제 구현 로직
  }
}
```
**역할:** 실제 작업을 수행하는 구현체

## 🔄 실무 활용 예시

### 1. 이벤트 처리 시스템
```typescript
interface EventDelegate {
  onClick(event: MouseEvent): void;
  onSubmit(data: FormData): void;
  onError(error: Error): void;
}

class ButtonComponent {
  constructor(private eventDelegate: EventDelegate) {}
  
  handleClick(event: MouseEvent) {
    // 이벤트 처리를 delegate에게 위임
    this.eventDelegate.onClick(event);
  }
}

// 다양한 이벤트 처리 방식
class AlertEventDelegate implements EventDelegate {
  onClick(event: MouseEvent) {
    alert("버튼이 클릭되었습니다!");
  }
  
  onSubmit(data: FormData) {
    alert("폼이 제출되었습니다!");
  }
  
  onError(error: Error) {
    alert(`에러 발생: ${error.message}`);
  }
}

class LoggingEventDelegate implements EventDelegate {
  onClick(event: MouseEvent) {
    console.log("Click event logged:", event);
  }
  
  onSubmit(data: FormData) {
    console.log("Submit event logged:", data);
  }
  
  onError(error: Error) {
    console.error("Error logged:", error);
  }
}
```

### 2. 로깅 시스템
```typescript
interface LoggerDelegate {
  log(level: string, message: string): void;
  error(error: Error): void;
}

class Application {
  constructor(private logger: LoggerDelegate) {}
  
  start() {
    this.logger.log("INFO", "애플리케이션 시작");
    try {
      // 애플리케이션 로직
    } catch (error) {
      this.logger.error(error);
    }
  }
}

// 개발 환경용 로거
class ConsoleLoggerDelegate implements LoggerDelegate {
  log(level: string, message: string) {
    console.log(`[${level}] ${message}`);
  }
  
  error(error: Error) {
    console.error(`[ERROR] ${error.message}`);
  }
}

// 프로덕션 환경용 로거
class FileLoggerDelegate implements LoggerDelegate {
  log(level: string, message: string) {
    // 파일에 로그 저장
    this.writeToFile(`[${level}] ${new Date().toISOString()} ${message}`);
  }
  
  error(error: Error) {
    this.writeToFile(`[ERROR] ${new Date().toISOString()} ${error.message}`);
  }
  
  private writeToFile(message: string) {
    // 실제 파일 쓰기 로직
  }
}
```

### 3. 네트워크 통신
```typescript
interface NetworkDelegate {
  send(data: any): Promise<Response>;
  receive(): Promise<any>;
}

class ApiClient {
  constructor(private networkDelegate: NetworkDelegate) {}
  
  async fetchUserData(userId: number) {
    // 네트워크 통신을 delegate에게 위임
    const response = await this.networkDelegate.send({
      action: 'fetchUser',
      userId
    });
    return response;
  }
}

// HTTP 통신
class HttpNetworkDelegate implements NetworkDelegate {
  async send(data: any): Promise<Response> {
    return fetch('/api/users', {
      method: 'POST',
      body: JSON.stringify(data)
    });
  }
  
  async receive(): Promise<any> {
    const response = await fetch('/api/notifications');
    return response.json();
  }
}

// WebSocket 통신
class WebSocketNetworkDelegate implements NetworkDelegate {
  private ws: WebSocket;
  
  constructor() {
    this.ws = new WebSocket('ws://localhost:8080');
  }
  
  async send(data: any): Promise<Response> {
    return new Promise((resolve) => {
      this.ws.send(JSON.stringify(data));
      this.ws.onmessage = (event) => {
        resolve(new Response(event.data));
      };
    });
  }
  
  async receive(): Promise<any> {
    return new Promise((resolve) => {
      this.ws.onmessage = (event) => {
        resolve(JSON.parse(event.data));
      };
    });
  }
}
```

## ⚡ 장점과 단점

### ✅ 장점

#### 1. **단일 책임 원칙 (Single Responsibility Principle)**
```typescript
// 각 객체가 자신의 역할에만 집중
class UserService {           // 비즈니스 로직에만 집중
  constructor(private repo: UserRepository) {}
}

class UserRepository {        // 데이터 접근 로직에만 집중
  constructor(private delegate: DatabaseDelegate) {}
}
```

#### 2. **유연성 (Flexibility)**
```typescript
// 런타임에 동작 변경 가능
const service = new UserService(new UserRepository(prismaDelegate));
// 나중에 다른 데이터베이스로 변경
service.repository.setDelegate(typeormDelegate);
```

#### 3. **테스트 용이성 (Testability)**
```typescript
// Mock delegate로 쉬운 테스트
class MockDatabaseDelegate implements DatabaseDelegate {
  findUnique = jest.fn();
  create = jest.fn();
}

const mockDelegate = new MockDatabaseDelegate();
const repository = new UserRepository(mockDelegate);
// 실제 DB 없이 테스트 가능
```

#### 4. **코드 재사용성 (Reusability)**
```typescript
// 동일한 delegate를 여러 곳에서 사용
const loggerDelegate = new FileLoggerDelegate();
const userService = new UserService(loggerDelegate);
const orderService = new OrderService(loggerDelegate);
```

#### 5. **확장성 (Extensibility)**
```typescript
// 새로운 기능을 delegate로 추가
class CacheableStorageDelegate implements StorageDelegate {
  constructor(
    private baseDelegate: StorageDelegate,
    private cache: Cache
  ) {}
  
  save(data: string) {
    this.baseDelegate.save(data);
    this.cache.set(data);  // 캐싱 기능 추가
  }
}
```

### ❌ 단점

#### 1. **복잡성 증가**
```typescript
// 단순한 작업도 여러 클래스와 인터페이스 필요
interface SimpleDelegate { doSomething(): void; }
class ConcreteDelegateA implements SimpleDelegate { ... }
class ConcreteDelegateB implements SimpleDelegate { ... }
class Delegator { constructor(private delegate: SimpleDelegate) {} }
```

#### 2. **간접 호출 오버헤드**
```typescript
// 직접 호출: client.save()
// Delegate 사용: client.delegator.delegate.save()
// 메서드 호출이 한 단계 더 거쳐감
```

#### 3. **디버깅 복잡성**
```typescript
// 실제 실행되는 코드를 찾기 위해 여러 클래스를 거쳐야 함
client.method() 
  → delegator.method() 
  → delegate.method() 
  → concreteDelegate.method() // 실제 실행 지점
```

## 🏗️ 프로젝트 적용 사례

### 현재 프로젝트의 Delegate Pattern 구조

```typescript
// 1. Repository (위임자)
class UserRepository extends BaseRepository {
  constructor(
    @Inject(DATABASE_ADAPTER_FACTORY) 
    adapterFactory: DatabaseAdapterFactory
  ) {
    super();
    // DatabaseDelegate 획득
    this.delegate = adapterFactory.createAdapter('user');
  }
  
  async findById(id: number) {
    // 실제 DB 작업을 delegate에게 위임
    return this.delegate.findUnique({ where: { id } });
  }
  
  async create(userData: CreateUserDto) {
    // 생성 작업도 delegate에게 위임
    return this.delegate.create({ data: userData });
  }
}

// 2. DatabaseDelegate (수임자 인터페이스)
export interface DatabaseDelegate {
  findUnique: (args: any) => Promise<any>;
  findFirst: (args: any) => Promise<any>;
  findMany: (args: any) => Promise<any>;
  count: (args: any) => Promise<number>;
  create: (args: { data: any }) => Promise<any>;
  createMany: (args: { data: any[] }) => Promise<{ count: number }>;
  update: (args: { where: any; data: any }) => Promise<any>;
  updateMany: (args: { where: any; data: any }) => Promise<{ count: number }>;
  upsert: (args: { where: any; create: any; update: any }) => Promise<any>;
  delete: (args: { where: any }) => Promise<any>;
  deleteMany: (args: { where: any }) => Promise<{ count: number }>;
}

// 3. Concrete Delegate (구체적 수임자)
// 현재: prismaClient.user (Prisma User Delegate)
// 미래: typeormRepository, sequelizeModel 등
```

### 흐름도
```
UserService
    ↓ (비즈니스 로직)
UserRepository (위임자)
    ↓ (작업 위임)
DatabaseDelegate (수임자 인터페이스)
    ↓ (실제 구현)
prismaClient.user (Prisma User Delegate)
    ↓ (데이터베이스 쿼리)
PostgreSQL Database
```

### 다중 ORM 지원 시나리오
```typescript
// Prisma 환경
const prismaDelegate = prismaClient.user;
const prismaRepository = new UserRepository(prismaDelegate);

// TypeORM 환경 (미래)
const typeormAdapter = new TypeORMAdapter(typeormRepository);
const typeormRepository = new UserRepository(typeormAdapter);

// Sequelize 환경 (미래)
const sequelizeAdapter = new SequelizeAdapter(sequelizeModel);
const sequelizeRepository = new UserRepository(sequelizeAdapter);

// 동일한 Repository 인터페이스로 모든 ORM 지원!
```

## 📋 사용 가이드라인

### ✅ 사용하기 좋은 경우

#### 1. **런타임 동작 변경이 필요할 때**
```typescript
// 환경에 따라 다른 구현체 사용
const delegate = process.env.NODE_ENV === 'production' 
  ? new ProductionDelegate() 
  : new DevelopmentDelegate();
```

#### 2. **다양한 구현체를 교체 가능하게 하고 싶을 때**
```typescript
// 저장 방식: 로컬, 클라우드, 메모리
// 로깅 방식: 콘솔, 파일, 데이터베이스
// 통신 방식: HTTP, WebSocket, gRPC
```

#### 3. **테스트에서 실제 구현체를 Mock으로 대체하고 싶을 때**
```typescript
// 실제 API 호출 대신 Mock 사용
const mockApiDelegate = new MockApiDelegate();
const service = new UserService(mockApiDelegate);
```

#### 4. **플랫폼별 구현이 달라야 할 때**
```typescript
// iOS, Android, Web별로 다른 구현
const platformDelegate = Platform.OS === 'ios' 
  ? new IOSDelegate() 
  : new AndroidDelegate();
```

#### 5. **확장 가능한 플러그인 시스템을 만들 때**
```typescript
// 다양한 플러그인을 delegate로 구현
class PluginManager {
  constructor(private plugins: PluginDelegate[]) {}
}
```

### ❌ 사용하지 않는 게 좋은 경우

#### 1. **구현이 단순하고 고정적일 때**
```typescript
// 간단한 계산기에서는 과도한 추상화
class Calculator {
  add(a: number, b: number) { return a + b; }  // 이걸로 충분
}
```

#### 2. **성능이 매우 중요한 경우**
```typescript
// 고성능 게임 엔진, 실시간 시스템 등
// 간접 호출 오버헤드가 문제될 수 있음
```

#### 3. **소규모 프로젝트에서 과도한 추상화가 될 때**
```typescript
// 간단한 CRUD 앱에서는 직접 구현이 더 나을 수 있음
```

#### 4. **팀 구성원의 경험 수준이 낮을 때**
```typescript
// 복잡한 패턴보다는 직관적인 코드가 나을 수 있음
```

## 🎯 결론

**Delegate Pattern**은 **"책임을 나누어 관리"**하는 강력한 패턴입니다. 특히 다음과 같은 상황에서 빛을 발합니다:

- **유연성이 중요한 시스템**
- **다양한 구현체 지원이 필요한 경우**  
- **테스트 가능성을 높이고 싶을 때**
- **확장 가능한 아키텍처를 구축할 때**

현재 프로젝트에서도 Repository Pattern과 결합하여 **ORM 독립적인 데이터 접근 계층**을 구축하는 데 핵심 역할을 하고 있습니다.

---

> **"Don't do everything yourself. Delegate to specialists."** 
> 
> *- Delegate Pattern의 핵심 철학*