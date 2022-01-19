#include <stdio.h>
void week1(){
    int x = 5;
    int y = -x /10;
    int z = 0&&--x;
    printf("%d %d %d", x, y, z);
    
}

void week2(){
    int x = 5;
    int y = 10;
    int ans = 0;
    while (--y >= 0){
        ans += x;
    }
    printf("%d", ans);
    enum Color {BLUE, RED, PINK, GREEN};
    enum Fruit {Banana, Apple, Orange};
    
    
}

void week3_02(){
    int x = 1, y = 2;
    switch (y) {
        case 1: x += 1;
                break;
        case 2: x += 2;
                break;
        case 3: x += 3;
                break;
        default: x += 4;
                break;
    }
    //printf("x: %d\n", x);
    for (int x = 1000; x >= 2; x -= 2) {
        //printf("%d ", x);
    }
    do 


}

int main()
{
    week3_02();
    return 0;
}
