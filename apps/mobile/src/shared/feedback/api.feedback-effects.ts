import { createAudioPlayer } from "expo-audio";
import type { AudioPlayer } from "expo-audio";
import { NotificationFeedbackType, notificationAsync } from "expo-haptics";

import addSound from "../../../assets/sounds/add.wav";
import coinSound from "../../../assets/sounds/coin.wav";
import paySound from "../../../assets/sounds/pay.wav";
import successSound from "../../../assets/sounds/success.wav";

/** Sons de l'application, synthétisés pour Mitemo. */
const SOUNDS = { success: successSound, coin: coinSound, add: addSound, pay: paySound } as const;

/**
 * Un son de l'application : le carillon de réussite, la pièce qui arrive,
 * le « pop » d'un ajout ou le tintement d'un paiement lancé.
 */
export type FeedbackSound = keyof typeof SOUNDS;

/** Volume des sons, discret pour ne pas surprendre en public. */
const SOUND_VOLUME = 0.6;

/** Lecteurs déjà créés, réutilisés d'un son à l'autre. */
const players = new Map<FeedbackSound, AudioPlayer>();

/**
 * Retrouve le lecteur d'un son, créé à la première lecture.
 * @param sound Son voulu.
 * @returns Son lecteur.
 */
function playerOf(sound: FeedbackSound): AudioPlayer {
  const existing = players.get(sound);
  if (existing !== undefined) return existing;
  const player = createAudioPlayer(SOUNDS[sound]);
  player.volume = SOUND_VOLUME;
  players.set(sound, player);
  return player;
}

/**
 * Joue un son depuis son début. Un son est un agrément : un échec de lecture
 * ne doit jamais interrompre l'opération qu'il accompagne, il est donc
 * signalé par le résultat plutôt que par une erreur.
 * @param sound Son à jouer.
 * @returns `true` si la lecture a démarré.
 */
export async function playFeedbackSound(sound: FeedbackSound): Promise<boolean> {
  const player = playerOf(sound);
  try {
    await player.seekTo(0);
    player.play();
    return true;
  } catch {
    return false;
  }
}

/**
 * Joue le retour haptique de réussite du système (UINotificationFeedback sur
 * iOS, Vibrator sur Android). Comme le son, il ne doit jamais faire échouer
 * l'opération : un échec est signalé par le résultat.
 * @returns `true` si le retour a été joué.
 */
export async function playSuccessHaptic(): Promise<boolean> {
  try {
    await notificationAsync(NotificationFeedbackType.Success);
    return true;
  } catch {
    return false;
  }
}
