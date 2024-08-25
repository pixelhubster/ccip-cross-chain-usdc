const networks = {
    ethereumSepolia: {
        router: "0x0BF3dE8c5D3e8A2B34D2BEeB17ABfCeBaf363A59",
        chainSelector: "16015286601757825753",
        linkToken: "0x779877A7B0D9E8603169DdbD7836e478b4624789",
    },
    avalancheFuji: {
        router: "0xF694E193200268f9a4868e4Aa017A0118C9a8177",
        chainSelector: "14767482510784806043",
        linkToken: "0x5425890298aed601595a70AB815c96711a31Bc65"
    }
}

type ISupportedNetworks = keyof typeof networks;

const ccipConfig = (network: ISupportedNetworks) => {
    if (networks[network]) return networks[network];
    throw new Error("Unknown network: " + network);
}

export { ccipConfig, networks, ISupportedNetworks}