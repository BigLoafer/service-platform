
import query from 'query-string';

export function getQueryString(name: any) {
  const obj = query.parse(window.location.search);
  return obj[name];
}

export function getUrlRelativePath() {
  return window.location.pathname + window.location.search;
}
