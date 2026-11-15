// handleRoute's context defaults to `never`, which Next's generated route types reject.
// Routes without path params pass this.
export interface NoParams {
  params: Promise<unknown>
}
