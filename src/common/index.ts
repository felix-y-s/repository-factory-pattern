/**
 * Common Module Index
 *
 * 모든 공통 기능을 한 곳에서 export
 * 깔끔한 import 경로 제공
 *
 * @example
 * // Before
 * import { DATABASE_ADAPTER_FACTORY } from 'src/common/constants/tokens';
 * import { IBaseRepository } from 'src/common/interfaces/repository.interface';
 *
 * // After
 * import { DATABASE_ADAPTER_FACTORY, IBaseRepository } from 'src/common';
 */

// Constants and Tokens
export * from './constants';

// Interfaces
export * from './interfaces';

// Types
export * from './types';
