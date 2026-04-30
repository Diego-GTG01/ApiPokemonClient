export interface Result <T> {
  message : String,
  correct : boolean,
  object : T,
  objects : T [],
  error : T;
}