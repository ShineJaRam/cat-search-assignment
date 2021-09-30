export interface CatInfo {
  id: string;
  name: string;
  image: {
    id?: string;
    width?: number;
    height?: number;
    url?: string;
  };
}
