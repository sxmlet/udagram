export class ErrorWithCode extends Error {

  public constructor(private msg: string, private code: number) {
    super(msg);

  }

  public getCode(): number {
    return this.code;
  }

}
