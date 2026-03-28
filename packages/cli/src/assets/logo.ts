import chalk from 'chalk';

/**
 * Create gradient effect from bottom to top
 * Bottom: white (RGB 255,255,255)
 * Top: gray (RGB 128,128,128) - 50% white
 */
const createGradient = (text: string): string => {
  const lines = text.split('\n');
  const totalLines = lines.length;
  
  return lines.map((line, index) => {
    if (line.trim() === '') return line;
    
    // Reverse index: last line = bottom (white), first line = top (gray)
    const reversedIndex = totalLines - 1 - index;
    const ratio = reversedIndex / (totalLines - 1 || 1);
    
    // Bottom (ratio 1) = white (255), Top (ratio 0) = gray (128)
    const grayValue = Math.floor(128 + (ratio * 127)); // 128 -> 255
    
    return chalk.rgb(grayValue, grayValue, grayValue)(line);
  }).join('\n');
};

export const renderLogo = () => {
  const logo = `
██╗     ██╗   ██╗███╗   ██╗ █████╗ ██████╗     ██╗  ██╗██╗████████╗
██║     ██║   ██║████╗  ██║██╔══██╗██╔══██╗    ██║ ██╔╝██║╚══██╔══╝
██║     ██║   ██║██╔██╗ ██║███████║██████╔╝    █████╔╝ ██║   ██║
██║     ██║   ██║██║╚██╗██║██╔══██║██╔══██╗    ██╔═██╗ ██║   ██║
███████╗╚██████╔╝██║ ╚████║██║  ██║██║  ██║    ██║  ██╗██║   ██║
╚══════╝ ╚═════╝ ╚═╝  ╚═══╝╚═╝  ╚═╝╚═╝  ╚═╝    ╚═╝  ╚═╝╚═╝   ╚═╝
`;

  console.log(createGradient(logo));
};

/**
 * Render gradient text for titles
 */
export const renderGradientText = (text: string): string => {
  return chalk.cyan(text);
};

/**
 * Render progress bar
 * @param current Current progress
 * @param total Total steps
 * @param width Width of the progress bar
 */
export const renderProgressBar = (current: number, total: number, width: number = 30): string => {
  const percentage = Math.min(100, Math.max(0, (current / total) * 100));
  const filled = Math.floor((percentage / 100) * width);
  const empty = width - filled;
  
  const filledBar = '█'.repeat(filled);
  const emptyBar = '░'.repeat(empty);
  
  return `${filledBar}${emptyBar} ${Math.round(percentage)}%`;
};

/**
 * Render loading spinner with progress
 */
export const renderLoadingWithProgress = (message: string, current: number, total: number): string => {
  const frames = ['⠋', '⠙', '⠹', '⠸', '⠼', '⠴', '⠦', '⠧', '⠇', '⠏'];
  const frameIndex = Date.now() % (frames.length * 100) / 100;
  const frame = frames[Math.floor(frameIndex) % frames.length];
  const progress = renderProgressBar(current, total, 20);
  
  return `${chalk.cyan(frame)} ${message} ${chalk.dim(`[${progress}]`)}`;
};
