export interface AgentAdapter {
  name: string;
  description: string;
  install(targetDir: string, dryRun: boolean): Promise<void>;
}
