export class NextRequest extends Request {
  constructor(url, init = {}) {
    super(url, init);
    this._json = init.body ? JSON.parse(init.body) : null;
  }
  async json() {
    if (this._json !== null) return this._json;
    const text = await this.text();
    return text ? JSON.parse(text) : {};
  }
}

export const NextResponse = {
  json: (data, opts = {}) => ({
    status: opts.status || 200,
    json: async () => data,
  }),
};
