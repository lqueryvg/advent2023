const main = () => {
  return 'manual, see comments'
}

export { main }

/*
Examined the graph.
There are 4 "ganglions" which each consist of:
- a chain of 12 flip-flops each representing a binary digit
- each pulse to the end of the chain increases the binary number
- when the binary number is full (all 1s) it overflows back to 0
- some of the digits feed back into a conjuctor
All 4 conjunctors feed into a single conjuctor which will send a low signal to rx.
Example bit patterns are:
pm 111101001101 3917
jd 111111011001 4057
nf 111101100111 3943
qm 111101011011 3931
LCM of these numbers gives the answer:
3917 * 4057 * 3943 * 3931
= 246313604784977
*/
