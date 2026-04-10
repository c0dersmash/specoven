import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

export async function ensureDir(dirPath: string, dryRun = false): Promise<void> {
  if (dryRun) {
    console.log(`  [dry-run] mkdir -p ${dirPath}`);
    return;
  }
  await fs.promises.mkdir(dirPath, { recursive: true });
}

export async function writeFile(filePath: string, content: string, dryRun = false): Promise<void> {
  if (dryRun) {
    console.log(`  [dry-run] write ${filePath}`);
    return;
  }
  await fs.promises.mkdir(path.dirname(filePath), { recursive: true });
  await fs.promises.writeFile(filePath, content, 'utf8');
}

export async function copyFile(src: string, dest: string, dryRun = false): Promise<void> {
  if (dryRun) {
    console.log(`  [dry-run] copy ${src} → ${dest}`);
    return;
  }
  await fs.promises.mkdir(path.dirname(dest), { recursive: true });
  await fs.promises.copyFile(src, dest);
}

export async function copyDir(srcDir: string, destDir: string, dryRun = false): Promise<void> {
  if (!fs.existsSync(srcDir)) return;

  const entries = await fs.promises.readdir(srcDir, { withFileTypes: true });

  for (const entry of entries) {
    const srcPath = path.join(srcDir, entry.name);
    const destPath = path.join(destDir, entry.name);

    if (entry.isDirectory()) {
      await ensureDir(destPath, dryRun);
      await copyDir(srcPath, destPath, dryRun);
    } else {
      await copyFile(srcPath, destPath, dryRun);
    }
  }
}

export async function fileExists(filePath: string): Promise<boolean> {
  try {
    await fs.promises.access(filePath);
    return true;
  } catch {
    return false;
  }
}

export function applyPlaceholders(content: string, vars: Record<string, string>): string {
  let result = content;
  for (const [key, value] of Object.entries(vars)) {
    result = result.replaceAll(`{{${key}}}`, value);
  }
  return result;
}

export async function findTemplatesDir(): Promise<string> {
  const candidates = [
    path.join(path.dirname(fileURLToPath(import.meta.url)), '..', '..', 'templates'),
    path.join(process.cwd(), 'templates'),
  ];

  for (const candidate of candidates) {
    if (fs.existsSync(candidate)) {
      return candidate;
    }
  }

  throw new Error('Could not find templates directory. Is specoven installed correctly?');
}
