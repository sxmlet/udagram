import {Request} from "express";
import {PORT} from "./constants";

/**
 * Returns the current path suffixed with the provided subpath.
 *
 * @param req
 *   The request.
 * @param subpath
 *   The subpath.
 */
export function getUriFromRequest(req: Request, subpath: string): string {
  const regexp = new RegExp('^/|/$');
  console.log(req.path)
  return `${req.protocol}://${req.hostname}:${PORT}${req.path}${subpath}`;
}
