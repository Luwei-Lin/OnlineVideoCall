#include <stdio.h> // standard input/output needs to be included
int main()
{
  int x = 100;  // set to different values > 0 to test your program
  int j = 1;  // should start from 1
  int count = 0; // need to initialize 'count'
  while (x >= j) {// '>=' replace '>'
    if (x % j == 0) {// "=" changes to "=="
      ++count;
    } 
    ++j; //needs to be "++j" and outside if...else otherwise it will be unstoppable because "x > j" always true
     
  }

  printf("%d can be divided by %d numbers\n", x, count);//"print" changes to "printf" 'd' => "%d", second parameter should be "count"
  return 0;
}
/*
Test results
        x       output
        0       0
        4       3
        100     9

*/