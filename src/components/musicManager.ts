export class MusicManager {
    private static instance: MusicManager;
    private static sharedSounds = new Map<string, HTMLAudioElement>();

    private constructor() {
        this.loadSharedSounds();
    }

    public static getInstance(): MusicManager {
        if (!MusicManager.instance) {
            MusicManager.instance = new MusicManager();
        }
        return MusicManager.instance;
    }

    private loadSharedSounds(): void {
        const files = ['/drum-roll.mp3', '/drum-roll-intro.mp3', '/drum-roll-hit.mp3'];

        for (const file of files) {
            const audio = new Audio(file);
            audio.preload = 'auto';
            audio.load();
            MusicManager.sharedSounds.set(file, audio);
        }
    }

    public playDrumRoll(seconds: number): void {
        const drumRollIntro = MusicManager.sharedSounds.get('/drum-roll-intro.mp3');
        const drumRollHit = MusicManager.sharedSounds.get('/drum-roll-hit.mp3');

        if (!drumRollIntro || !drumRollHit) {
            return;
        }

        drumRollIntro.loop = true;
        drumRollIntro.play();

        setTimeout(() => {
            drumRollIntro.pause()
            drumRollHit.play()
        }, seconds * 1000);
    }

    public playSound(file: string): void {
        const baseAudio = MusicManager.sharedSounds.get(file);
        if (!baseAudio) {
            console.warn(`Sound not preloaded: ${file}`);
            return;
        }

        const clone = baseAudio.cloneNode(true) as HTMLAudioElement;
        clone.play().catch(err => {
            console.error(`Failed to play ${file}:`, err);
        });
    }
}
