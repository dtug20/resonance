export interface QuickAction {
    title: string;
    description: string;
    gradient: string;
    href: string;
};

export const quickActions: QuickAction[] = [
    {
        title: "Narrate a Story",
        description: "Bring characters to life with expressive AI narration",
        gradient: "from-cyan-400 to-cyan-100",
        href: "/text-to-speech?text=In a village, there was a small bakery...",
    },
    {
        title: "Record an Ad",
        description: "Create professional advertisements with lifelike AI voices",
        gradient: "from-pink-400 to-pink-100",
        href: "/text-to-speech?text=Looking for the best coffee in town? Look no further...",
    },
    {
        title: "Direct a Movie Scene",
        description: "Generate dramatic dialogue for film and video",
        gradient: "from-purple-400 to-purple-100",
        href: "/text-to-speech?text=I told you not to come back here. Now we both have to pay the price.",
    },
    {
        title: "Voice a Game Character",
        description: "Build immersive worlds with dynamic character voices",
        gradient: "from-orange-400 to-orange-100",
        href: "/text-to-speech?text=Halt! Who goes there? State your business or face the consequences.",
    },
    {
        title: "Introduce Your Podcast",
        description: "Hook your listeners from the very first second",
        gradient: "from-blue-400 to-blue-100",
        href: "/text-to-speech?text=Welcome to the deep dive, the podcast where we explore the unknown...",
    },
    {
        title: "Guide a Meditation",
        description: "Craft soothing, calming audio for wellness content",
        gradient: "from-lime-400 to-lime-100",
        href: "/text-to-speech?text=Take a deep breath in... and let it out slowly. Feel the tension leaving your body.",
    }
];