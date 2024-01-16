export interface ContentElement {
  name: string;
  path?: string;
  collection?: string;
  children?: ContentElement[];
}

export interface ContentTree {
  data: ContentElement[];
}
