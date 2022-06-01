type PromiseRes<T> = Promise<HttpRes<T>>

interface HttpRes<T> {
  code: number,
  data: T,
  message: string
}
