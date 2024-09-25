# Setup

1. Clone the repo
2. Access the `bleu-task` folder
   ```bash
   cd bleu-task
   ```
3. Install dependencies
   ```bash
   yarn
   ```
4. Create a copy `env.example` called `env.local` and fill in environment variables

# Running

1. Run the project
   ```bash
   yarn dev
   ```
2. It will be accessible at [localhost:3000](http://localhost:3000/)

# Features by Priority

1. **Searchbar for searching pool's address**: After connecting the app to the wallet, the user needs to be able to search for a pool.
2. **Read and update metadata field**: If the searched pool exists, the app enables reading the current metadata and updating it.
3. **Menu with all pools owned by connected wallet**: Improves user experience by automatically showing all pools owned by the connected wallet.
4. **Recent searches**: Improves user experience by displaying the last 5 searched pools.

# Implemented Features and Prioritization Rationale

- **Searchbar for pool's address**: Prioritized as the main user interaction for finding and managing their pool data. This feature is essential for the dApp to achieve the expected behavior.
- **Read and update metadata field**: This functionality was crucial for interacting with the Balancer Pool Metadata contract, enabling users to update metadata via IPFS.
- **Menu with owned pools**: Focused on improving user navigation by automatically listing owned pools for faster access.
- **Recent searches**: Added to enhance user experience by providing easy access to previously searched pools.

# Architecture Decisions Overview

## 1. Project Overview

This dApp interacts with the Balancer Pool Metadata contract on the Sepolia testnet, allowing users to view and update metadata for Balancer pools using IPFS for storage. React was used for the frontend, with RainbowKit and wagmi handling wallet connections and blockchain interaction.

## 2. Tech Stack and Tools

- **React**: For building reusable UI components and structuring the frontend.
- **RainbowKit & wagmi**: Used to connect the wallet and interact with Ethereum smart contracts, specifically the Balancer Pool Metadata contract.
- **IPFS - Piñata**: Chosen for storing metadata in a decentralized, public and immutable manner (updated metadata is actually a new IPFS pin).
- **Vercel**: Used to deploy and host the dApp.

## 3. Core Functionalities

### 3.1. Fetching Metadata

- Metadata is fetched from the Balancer Pool Metadata smart contract on Sepolia.
- Pool metadata is displayed in a clear, easy-to-read format for the user.

### 3.2. Updating Metadata

- Users can pin new metadata to IPFS using Piñata, generating a new CID and updating it in the smart contract.
- This ensures that metadata is stored securely and decentralized on IPFS.

### 3.3. Sidebar with Owned Pools

- The sidebar lists all pools owned by the connected wallet, enabling users to easily manage metadata for multiple pools.

## 4. User Interface

### 4.1. Metadata Update Form

- A simple form allows users to update pool metadata. It is designed for ease of use and quick updates.

### 4.2. Overall UI Design

- The UI is kept minimalistic and clean, focusing on functionality over complex design elements to provide a user-friendly experience.

## 5. Code Structure and Testing

### 5.1. Component-Based Architecture

- The app is structured using React’s component-based approach, encapsulating key functionalities like metadata display, form updates, and the sidebar into reusable components.

### 5.2. Unit Testing

- Basic unit tests have been written.

## 6. Security Considerations

- Wallet connections and transaction signing are secured using RainbowKit and wagmi, ensuring that all interactions with the blockchain are properly authorized.

## 7. Assumptions and Simplifications

- **Simplification**: No bulk editing functionality was implemented, as the focus was on single pool management to meet the challenge requirements within the time limit.
- **Simplification**: UI design was kept minimal due to the time constraints and the fact that design elements were out of scope.
- **Simplification**: The dApp wasn't implemented as mobile-first, usage was focused on desktop.

# Links

[Deployed App on Vercel](https://bleu-challenge.vercel.app/)  
[Project Demo Video](https://www.loom.com/share/70bd40892de147e99cfe70f035e9f5b6?sid=ca88819e-5e46-4983-b3ab-db4646e751e3)

_Note_: As mentioned in the video, the demonstration was done with another wallet address as the owner. Not all pools listed in the sidebar in the video belong to the same user.
