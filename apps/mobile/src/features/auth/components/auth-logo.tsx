import Svg, { Path } from "react-native-svg";

import { AUTH_COLORS } from "../model/auth-theme";

/** Props du logo Mitemo blanc. */
export interface AuthLogoProps {
  /** Largeur du logo, en points. */
  readonly width?: number;
  /** Couleur des trois formes du logo. */
  readonly color?: string;
}

/**
 * Affiche le logo Mitemo posé sur le fond bleu de l'authentification.
 * @param props Largeur et couleur du logo.
 * @returns Le logo vectoriel.
 */
export function AuthLogo(props: AuthLogoProps) {
  const { width = 130, color = AUTH_COLORS.sheet } = props;
  const height = (width * 89) / 151;

  return (
    <Svg testID="auth-logo" width={width} height={height} viewBox="0 0 151 89" fill="none">
      <Path
        d="M0 70.0242V52.767C0 22.8989 19.2484 0 46.7934 0C58.4088 0 68.3648 3.98242 75.3341 8.96044C51.7714 10.6198 37.5011 27.8769 37.5011 52.767V70.0242C37.5011 74.9971 35.5256 79.7664 32.0092 83.2828C28.4928 86.7992 23.7235 88.7747 18.7505 88.7747C13.7776 88.7747 9.00832 86.7992 5.49191 83.2828C1.9755 79.7664 0 74.9971 0 70.0242Z"
        fill={color}
      />
      <Path
        d="M56.7495 70.0242V52.767C56.7495 22.8989 77.6571 0 104.87 0C129.76 0 146.354 14.6022 150.668 39.4923C144.695 24.5582 133.079 18.9165 121.464 18.9165C103.211 18.9165 94.2505 34.5143 94.2505 54.4264V70.0242C94.2505 74.9971 92.2751 79.7664 88.7586 83.2828C85.2422 86.7992 80.473 88.7747 75.5 88.7747C70.527 88.7747 65.7578 86.7992 62.2414 83.2828C58.7249 79.7664 56.7495 74.9971 56.7495 70.0242Z"
        fill={color}
      />
      <Path
        d="M113.499 70.0241V47.1252C113.499 42.1523 115.474 37.383 118.991 33.8666C122.507 30.3502 127.276 28.3747 132.249 28.3747C137.222 28.3747 141.992 30.3502 145.508 33.8666C149.024 37.383 151 42.1523 151 47.1252V70.0241C151 74.9971 149.024 79.7664 145.508 83.2828C141.992 86.7992 137.222 88.7747 132.249 88.7747C127.276 88.7747 122.507 86.7992 118.991 83.2828C115.474 79.7664 113.499 74.9971 113.499 70.0241Z"
        fill={color}
      />
    </Svg>
  );
}
