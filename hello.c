#include <stdio.h>
void swap(int *a,int *b){
    int temp = *a;
    *a = *b;
    *b = temp;
}
int main(){
    int a = 8;
    int b = 6;
    printf("a = %d, b = %d\n", a, b);
    swap(&a, &b);
    printf("after swapping...\na = %d, b = %d\n", a, b);
}

