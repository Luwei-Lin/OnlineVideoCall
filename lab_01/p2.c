#include <stdio.h>
#include <limits.h>
#include <assert.h>
int main(){
    unsigned int y = UINT_MAX;
    //assert(y <= ULLONG_MAX);
    //we can use assert() here to prevent user entry the overflow number.

    unsigned int count = 0;

    while ( count < 65535 && count * count < y){
        // prevent overflow count < 65535 or use count * count < 'UINT_MAX' same as y
        ++count;
    } 
    if (count * count > y) { // max k before the target 
        printf("%u\n", count - 1);
    } else {// count * count == y exact number can power 2 to equal y.
        printf("%u\n", count);
    }
    return 0;
}
/*test result
    y   output
    0   0
    1   1
    2   1
    3   1
    ...
    1024 32
    1025 32
    ...
    4294967295 65535
    overflow wrap around
(0)4294967296 0
(1)4294967297 1
(2)4292967298 1
(3)4292967299 1
(4)4294967300 2

*/