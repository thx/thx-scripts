export interface IDevEnv {
  // ===== 本地服务 =====
  PORT?: string;
  HTTPS? : 'true';

  // ===== 构建分析 =====
  ANALYZE? : 'true';
  ANALYZE_PORT? : string;

  // ===== 模拟代理 =====
  MOCK? : 'true';
  RAP_ID? : string;
  RAP_HOST? : string;

  // ===== 服务代理 =====
  PROXY_IP? : string;
  /** @deprecated 在 CLI 中需要，在 thx-scripts 中不需要 */
  PROXY_HOST? : string;
  PROXY_HTTPS?: 'true';
  PROXY_PORT?: string;

  // ===== 构建入口 =====
  PAGE? : string;
}
