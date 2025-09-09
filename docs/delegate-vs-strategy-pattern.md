# Delegate Pattern vs Strategy Pattern

**Delegate Pattern**과 **Strategy Pattern**은 겉보기에 매우 유사하지만, **핵심 의도와 사용 맥락**에서 명확한 차이가 있습니다.

## 📖 목차

- [핵심 차이점](#핵심-차이점)
- [상세 비교](#상세-비교)
- [실무 구분법](#실무-구분법)
- [프로젝트 적용 분석](#프로젝트-적용-분석)
- [실무 판단 기준](#실무-판단-기준)
- [결론](#결론)

## 🎯 핵심 차이점

### Strategy Pattern: "어떻게(How)" - 알고리즘 교체

```typescript
// 🎯 목적: 다른 알고리즘으로 같은 결과 달성
interface SortStrategy {
  sort(data: number[]): number[];  // 같은 목적, 다른 방법
}

class QuickSortStrategy implements SortStrategy {
  sort(data: number[]) { 
    // 퀵정렬 알고리즘 구현
    console.log("퀵정렬로 데이터 정렬");
    return data.sort(); // 실제로는 퀵정렬 로직
  }
}

class BubbleSortStrategy implements SortStrategy {
  sort(data: number[]) { 
    // 버블정렬 알고리즘 구현
    console.log("버블정렬로 데이터 정렬");
    return data.sort(); // 실제로는 버블정렬 로직
  }
}

class MergeSortStrategy implements SortStrategy {
  sort(data: number[]) { 
    // 머지정렬 알고리즘 구현
    console.log("머지정렬로 데이터 정렬");
    return data.sort(); // 실제로는 머지정렬 로직
  }
}

class Sorter {
  constructor(private strategy: SortStrategy) {}
  
  // Context가 Strategy를 "선택하고 사용"
  sortData(data: number[]) {
    return this.strategy.sort(data);  // 방법만 다름, 결과는 같음
  }
  
  // 런타임에 전략 변경 가능
  changeStrategy(strategy: SortStrategy) {
    this.strategy = strategy;
  }
}

// 사용 예시
const sorter = new Sorter(new QuickSortStrategy());
sorter.sortData([3, 1, 4, 1, 5]);  // 퀵정렬로 실행

sorter.changeStrategy(new BubbleSortStrategy());
sorter.sortData([2, 7, 1, 8]);     // 버블정렬로 실행
```

**특징:**
- **동일한 결과, 다른 방법**: 모든 전략이 "정렬"이라는 같은 결과를 다른 방법으로 달성
- **성능 vs 안정성**: 각 알고리즘마다 시간복잡도, 안정성 등의 trade-off
- **빈번한 교체**: 데이터 크기, 상황에 따라 최적 알고리즘 선택

### Delegate Pattern: "누가(Who)" - 책임 위임

```typescript
// 🎯 목적: 다른 객체에게 책임 위임
interface StorageDelegate {
  save(data: string): void;           // 포괄적인 책임
  load(filename: string): string;
  delete(filename: string): void;
  list(): string[];
  backup(): void;
}

class LocalStorageDelegate implements StorageDelegate {
  private storage = new Map<string, string>();
  
  save(data: string) { 
    console.log("로컬 디스크에 저장");
    this.storage.set(`file_${Date.now()}`, data);
  }
  
  load(filename: string) {
    console.log("로컬 디스크에서 로드");
    return this.storage.get(filename) || "";
  }
  
  delete(filename: string) {
    console.log("로컬 파일 삭제");
    this.storage.delete(filename);
  }
  
  list() {
    return Array.from(this.storage.keys());
  }
  
  backup() {
    console.log("로컬 백업 실행");
  }
}

class CloudStorageDelegate implements StorageDelegate {
  save(data: string) { 
    console.log("클라우드에 저장");
    // AWS S3, Google Cloud Storage 등 호출
  }
  
  load(filename: string) {
    console.log("클라우드에서 로드");
    return "cloud_data";
  }
  
  delete(filename: string) {
    console.log("클라우드 파일 삭제");
  }
  
  list() {
    console.log("클라우드 파일 목록 조회");
    return ["cloud_file1", "cloud_file2"];
  }
  
  backup() {
    console.log("클라우드 백업 실행");
  }
}

class FileManager {
  constructor(private delegate: StorageDelegate) {}
  
  // Delegator가 Delegate에게 "위임"
  saveFile(data: string) {
    this.delegate.save(data);  // "너가 담당해줘"
  }
  
  loadFile(filename: string) {
    return this.delegate.load(filename);
  }
  
  manageFiles() {
    // 복합적인 파일 관리 작업도 delegate에게 위임
    const files = this.delegate.list();
    console.log(`관리할 파일 수: ${files.length}`);
    this.delegate.backup();
  }
}

// 사용 예시
const localManager = new FileManager(new LocalStorageDelegate());
localManager.saveFile("로컬 데이터");

const cloudManager = new FileManager(new CloudStorageDelegate());
cloudManager.saveFile("클라우드 데이터");
```

**특징:**
- **포괄적 책임**: 저장과 관련된 모든 작업을 담당
- **장기적 관계**: 한 번 설정하면 오랜 기간 유지
- **환경별 구현**: 플랫폼, 환경에 따른 다른 구현체

## 📊 상세 비교

| 구분 | Strategy Pattern | Delegate Pattern |
|------|------------------|-------------------|
| **핵심 질문** | "어떻게 할까?" (How) | "누가 할까?" (Who) |
| **목적** | 알고리즘 캡슐화 및 교체 | 책임 분리 및 위임 |
| **관계성** | Context가 Strategy를 **사용** | Delegator가 Delegate에게 **위임** |
| **범위** | 특정 작업/알고리즘 | 포괄적인 책임 영역 |
| **메서드 수** | 주로 1개 (핵심 알고리즘) | 여러 개 (관련 기능들) |
| **교체 빈도** | 작업별로 자주 교체 | 설정 시점에 결정, 장기 유지 |
| **변경 이유** | 성능, 정확도, 상황별 최적화 | 플랫폼, 환경, 기술 스택 변경 |
| **결과** | 같은 결과, 다른 방법 | 같은 책임, 다른 담당자 |

## 🔍 실무 구분법

### Strategy Pattern 사용 시나리오

#### 1. 데이터 검증 전략
```typescript
// 🎯 질문: "이 데이터를 어떻게 검증할까?"
interface ValidationStrategy {
  validate(data: string): boolean;  // 단일 목적, 다른 방법
}

class EmailValidationStrategy implements ValidationStrategy {
  validate(email: string): boolean {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  }
}

class PhoneValidationStrategy implements ValidationStrategy {
  validate(phone: string): boolean {
    const regex = /^\d{3}-\d{4}-\d{4}$/;
    return regex.test(phone);
  }
}

class StrictEmailValidationStrategy implements ValidationStrategy {
  validate(email: string): boolean {
    // 더 엄격한 이메일 검증 로직
    return email.includes('@') && email.includes('.') && email.length > 5;
  }
}

class Validator {
  constructor(private strategy: ValidationStrategy) {}
  
  validateInput(data: string): boolean {
    return this.strategy.validate(data);
  }
}
```

#### 2. 가격 계산 전략
```typescript
// 🎯 질문: "할인을 어떻게 계산할까?"
interface DiscountStrategy {
  calculateDiscount(price: number): number;
}

class NoDiscountStrategy implements DiscountStrategy {
  calculateDiscount(price: number): number {
    return 0;
  }
}

class PercentageDiscountStrategy implements DiscountStrategy {
  constructor(private percentage: number) {}
  
  calculateDiscount(price: number): number {
    return price * (this.percentage / 100);
  }
}

class FixedDiscountStrategy implements DiscountStrategy {
  constructor(private amount: number) {}
  
  calculateDiscount(price: number): number {
    return Math.min(this.amount, price);
  }
}
```

#### 3. 이미지 압축 전략
```typescript
// 🎯 질문: "이미지를 어떻게 압축할까?"
interface CompressionStrategy {
  compress(image: ImageData): CompressedImage;
}

class LosslessCompressionStrategy implements CompressionStrategy {
  compress(image: ImageData): CompressedImage {
    // PNG 방식 무손실 압축
    return { data: image.data, quality: 100 };
  }
}

class LossyCompressionStrategy implements CompressionStrategy {
  constructor(private quality: number) {}
  
  compress(image: ImageData): CompressedImage {
    // JPEG 방식 손실 압축
    return { data: image.data, quality: this.quality };
  }
}
```

### Delegate Pattern 사용 시나리오

#### 1. API 통신 위임
```typescript
// 🎯 질문: "API 통신을 누가 담당할까?"
interface ApiDelegate {
  get(url: string): Promise<any>;          // 포괄적 책임
  post(url: string, data: any): Promise<any>;
  put(url: string, data: any): Promise<any>;
  delete(url: string): Promise<any>;
  upload(file: File): Promise<any>;
  download(url: string): Promise<Blob>;
}

class HttpApiDelegate implements ApiDelegate {
  async get(url: string) {
    console.log(`HTTP GET: ${url}`);
    return fetch(url).then(res => res.json());
  }
  
  async post(url: string, data: any) {
    console.log(`HTTP POST: ${url}`);
    return fetch(url, { 
      method: 'POST', 
      body: JSON.stringify(data),
      headers: { 'Content-Type': 'application/json' }
    }).then(res => res.json());
  }
  
  async put(url: string, data: any) { /* PUT 구현 */ }
  async delete(url: string) { /* DELETE 구현 */ }
  async upload(file: File) { /* 파일 업로드 구현 */ }
  async download(url: string) { /* 파일 다운로드 구현 */ }
}

class GraphQLApiDelegate implements ApiDelegate {
  async get(url: string) {
    console.log(`GraphQL Query: ${url}`);
    // GraphQL 쿼리 실행
  }
  
  async post(url: string, data: any) {
    console.log(`GraphQL Mutation: ${url}`);
    // GraphQL 뮤테이션 실행
  }
  
  // 나머지 메서드들도 GraphQL 방식으로 구현
}
```

#### 2. 로깅 시스템 위임
```typescript
// 🎯 질문: "로깅을 누가 담당할까?"
interface LoggerDelegate {
  info(message: string): void;
  warn(message: string): void;
  error(error: Error): void;
  debug(message: string): void;
  trace(message: string): void;
  flush(): void;
  configure(config: LogConfig): void;
}

class ConsoleLoggerDelegate implements LoggerDelegate {
  info(message: string) { console.log(`[INFO] ${message}`); }
  warn(message: string) { console.warn(`[WARN] ${message}`); }
  error(error: Error) { console.error(`[ERROR] ${error.message}`); }
  debug(message: string) { console.debug(`[DEBUG] ${message}`); }
  trace(message: string) { console.trace(`[TRACE] ${message}`); }
  flush() { /* 콘솔은 즉시 출력 */ }
  configure(config: LogConfig) { /* 콘솔 설정 */ }
}

class FileLoggerDelegate implements LoggerDelegate {
  private logBuffer: string[] = [];
  
  info(message: string) { this.writeToBuffer(`[INFO] ${message}`); }
  warn(message: string) { this.writeToBuffer(`[WARN] ${message}`); }
  error(error: Error) { this.writeToBuffer(`[ERROR] ${error.message}`); }
  debug(message: string) { this.writeToBuffer(`[DEBUG] ${message}`); }
  trace(message: string) { this.writeToBuffer(`[TRACE] ${message}`); }
  
  flush() {
    // 파일에 일괄 쓰기
    console.log("로그 파일에 저장:", this.logBuffer.length, "건");
    this.logBuffer = [];
  }
  
  private writeToBuffer(message: string) {
    this.logBuffer.push(`${new Date().toISOString()} ${message}`);
  }
}
```

## 🏗️ 프로젝트 적용 분석

### 현재 DatabaseDelegate는 어떤 패턴일까?

```typescript
// 우리 프로젝트의 DatabaseDelegate
interface DatabaseDelegate {
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

class UserRepository {
  constructor(private delegate: DatabaseDelegate) {}
  
  async findById(id: number) {
    return this.delegate.findUnique({ where: { id } });
  }
  
  async createUser(userData: any) {
    return this.delegate.create({ data: userData });
  }
}
```

**→ 이것은 명확히 Delegate Pattern입니다!**

### 분석 근거

#### ✅ Delegate Pattern 특징들

1. **포괄적 책임**: 전체 데이터베이스 작업을 위임
   ```typescript
   // 11개의 다양한 DB 작업 메서드
   // CRUD 전체 영역을 담당
   ```

2. **다수 메서드**: 관련된 여러 메서드들의 집합
   ```typescript
   // 단일 메서드가 아닌 DB 작업 전체
   ```

3. **위임 관계**: Repository가 DB 작업을 delegate에게 맡김
   ```typescript
   // "데이터베이스 작업은 너가 담당해줘"
   this.delegate.findUnique({ where: { id } });
   ```

4. **핵심 질문**: "데이터베이스 작업을 누가 담당할까?"
   - Prisma가 담당? → PrismaDelegate
   - TypeORM이 담당? → TypeORMDelegate
   - Sequelize가 담당? → SequelizeDelegate

#### ❌ Strategy Pattern이 아닌 이유

1. **다른 알고리즘이 아님**: 모두 같은 데이터베이스 작업
2. **결과가 다를 수 있음**: ORM별로 반환 형태가 다를 수 있음
3. **성능 최적화가 목적이 아님**: 기술 스택 선택이 목적

### 만약 Strategy Pattern이었다면?

```typescript
// 만약 Strategy로 설계했다면 이렇게 될 것
interface QueryStrategy {
  executeQuery(query: QueryObject): Promise<any>;  // 단일 메서드
}

class OptimizedQueryStrategy implements QueryStrategy {
  executeQuery(query: QueryObject) { 
    // 성능 최적화된 쿼리 실행
  }
}

class SafeQueryStrategy implements QueryStrategy {
  executeQuery(query: QueryObject) { 
    // 안전성 중심 쿼리 실행
  }
}

class Repository {
  constructor(private queryStrategy: QueryStrategy) {}
  
  findById(id: number) {
    return this.queryStrategy.executeQuery({ 
      type: 'SELECT', 
      where: { id } 
    });
  }
}
```

하지만 이건 우리 설계 의도와 다릅니다. 우리는 **ORM별 구현체 교체**가 목적이지, **쿼리 실행 알고리즘 교체**가 목적이 아닙니다.

## 🎯 실무 판단 기준

### Strategy Pattern을 선택하세요

#### 상황
- **"어떤 알고리즘/방법으로?"**가 핵심 질문일 때
- 성능, 정확도, 품질 등의 trade-off를 고려해야 할 때
- 상황이나 조건에 따라 최적의 방법을 선택해야 할 때

#### 예시
```typescript
// ✅ Strategy 적합
- 정렬 알고리즘 (퀵정렬 vs 버블정렬 vs 머지정렬)
- 압축 알고리즘 (ZIP vs RAR vs 7Z)
- 검색 알고리즘 (선형검색 vs 이진검색 vs 해시검색)
- 할인 계산 (정액할인 vs 정률할인 vs 쿠폰할인)
- 암호화 방식 (AES vs RSA vs DES)
```

### Delegate Pattern을 선택하세요

#### 상황
- **"누가 이 책임을 담당할?"**이 핵심 질문일 때
- 포괄적인 기능 영역을 다른 객체에게 위임하고 싶을 때
- 플랫폼, 환경, 기술 스택별로 구현체를 분리하고 싶을 때

#### 예시
```typescript
// ✅ Delegate 적합
- 데이터베이스 작업 (Prisma vs TypeORM vs Sequelize)
- 파일 저장 (로컬 vs 클라우드 vs 메모리)
- API 통신 (HTTP vs GraphQL vs gRPC)
- 로깅 시스템 (콘솔 vs 파일 vs 데이터베이스)
- 렌더링 엔진 (React vs Vue vs Angular)
```

## 💡 패턴 조합 사용

실제 프로젝트에서는 두 패턴을 함께 사용하는 경우도 많습니다:

```typescript
// Strategy + Delegate 조합 예시
interface CacheStrategy {
  get(key: string): any;
  set(key: string, value: any): void;
}

class LRUCacheStrategy implements CacheStrategy { /* LRU 알고리즘 */ }
class FIFOCacheStrategy implements CacheStrategy { /* FIFO 알고리즘 */ }

interface StorageDelegate {
  save(data: any): Promise<void>;
  load(id: string): Promise<any>;
}

class DatabaseStorageDelegate implements StorageDelegate { /* DB 저장 */ }
class FileStorageDelegate implements StorageDelegate { /* 파일 저장 */ }

class DataManager {
  constructor(
    private cacheStrategy: CacheStrategy,    // Strategy: 캐싱 알고리즘
    private storageDelegate: StorageDelegate // Delegate: 저장 책임 위임
  ) {}
  
  async getData(id: string) {
    // 1. Strategy로 캐시 확인
    let data = this.cacheStrategy.get(id);
    
    if (!data) {
      // 2. Delegate에게 저장소 작업 위임
      data = await this.storageDelegate.load(id);
      this.cacheStrategy.set(id, data);
    }
    
    return data;
  }
}
```

## ✅ 결론

### 핵심 구분점

**Strategy Pattern**: "같은 목적, 다른 방법"
- 알고리즘의 다양성
- 성능 vs 품질 trade-off
- 상황별 최적화

**Delegate Pattern**: "다른 담당자, 같은 책임"  
- 책임의 위임
- 플랫폼/환경별 분리
- 기술 스택 추상화

### 우리 프로젝트 결론

우리 프로젝트의 `DatabaseDelegate`는 **데이터베이스 작업이라는 포괄적 책임을 ORM에게 위임**하는 것이므로, 명확히 **Delegate Pattern**입니다!

### 선택 가이드

```typescript
// 이런 질문을 하고 있다면...

"어떤 방식으로 정렬할까?"           → Strategy Pattern
"누가 데이터베이스를 담당할까?"      → Delegate Pattern

"어떻게 압축할까?"                → Strategy Pattern  
"누가 파일 저장을 담당할까?"        → Delegate Pattern

"어떤 알고리즘으로 검색할까?"       → Strategy Pattern
"누가 API 통신을 담당할까?"        → Delegate Pattern
```

두 패턴 모두 강력하고 유용하지만, **의도와 맥락을 정확히 파악**하는 것이 올바른 패턴 선택의 핵심입니다. 🎯

---

> **"Strategy asks 'How?', Delegate asks 'Who?'"**
> 
> *- 패턴 선택의 핵심 질문*