function fizzBuzzer(array)
{
	for (let i of array){
        if (i % 3 == 0 && i % 5 == 0)
            console.log("BuzzFizz");
        else if (i % 5 == 0)
            console.log("Fizz");
        else if (i % 3 == 0)
            console.log("Buzz");
        else
            console.log(i);}
}
let array = [];
for (let i = 10; i <= 250; i++) {
    array.push(i)
}
fizzBuzzer(array);
