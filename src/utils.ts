import fs from 'node:fs'

export function checkPath(path: string): 'directory' | 'file' | 'otherwise' {
  try {
    const stats = fs.statSync(path)

    switch (true) {
      case stats.isDirectory(): {
        return 'directory'
      }
      case stats.isFile(): {
        return 'file'
      }
      default: {
        return 'otherwise'
      }
    }
  } catch (err) {
    return 'otherwise'
  }
}