export class Playlist {

    id: number;
    title: string = '';
    videos: [''];

  constructor(values: Object = {}) {
    Object.assign(this, values);
  }
}
