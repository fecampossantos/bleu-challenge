import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import {
  arbitrum,
  base,
  mainnet,
  optimism,
  polygon,
  sepolia,
} from 'wagmi/chains';

export const config = getDefaultConfig({
  appName: 'RainbowKit App',
  projectId: '696151a83598edb9e59536c7b33819a5',
  chains: [
    mainnet,
    polygon,
    optimism,
    arbitrum,
    base,
    sepolia
  ],
  ssr: true,
});