/** Son importé : Metro le remplace par l'identifiant de l'asset embarqué. */
declare module "*.wav" {
  const asset: number;
  export default asset;
}
