export interface Result <T> {
  message : String,
  object : T,
  objects : T [],
  error : T;
}