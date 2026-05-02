export function resolveDevPort(args) {
  for (let index = 0; index < args.length; index += 1) {
    const arg = args[index];

    if ((arg === '--port' || arg === '-p') && index + 1 < args.length) {
      return args[index + 1];
    }

    if (arg.startsWith('--port=')) {
      return arg.slice('--port='.length);
    }
  }

  return '3001';
}

export function resolveDevHost(args) {
  for (let index = 0; index < args.length; index += 1) {
    const arg = args[index];

    if (arg === '--host' && index + 1 < args.length) {
      return args[index + 1];
    }

    if (arg.startsWith('--host=')) {
      return arg.slice('--host='.length);
    }
  }

  return '127.0.0.1';
}

export function collectServerArgs(args) {
  const collectedArgs = [];

  for (let index = 0; index < args.length; index += 1) {
    const arg = args[index];

    if ((arg === '--port' || arg === '-p') && index + 1 < args.length) {
      collectedArgs.push(arg, args[index + 1]);
      index += 1;
      continue;
    }

    if (arg.startsWith('--port=')) {
      collectedArgs.push(arg);
      continue;
    }

    if (arg === '--host' && index + 1 < args.length) {
      collectedArgs.push(arg, args[index + 1]);
      index += 1;
      continue;
    }

    if (arg.startsWith('--host=')) {
      collectedArgs.push(arg);
      continue;
    }

    if (arg.startsWith('-')) {
      collectedArgs.push(arg);
    }
  }

  return collectedArgs;
}
