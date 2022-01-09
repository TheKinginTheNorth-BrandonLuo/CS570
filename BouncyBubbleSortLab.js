var array=[]
for(let i=0;i<10;i++){
  array[i] = Math.floor(Math.random() * 100);
}
console.log(array);
console.log(BouncyBubbleSort(array));

function BouncyBubbleSort(arr){
    while (true) {
    let sorted = false;
    for(let j=0;j<arr.length - 1;j++) {
        if (arr[j]>arr[j+1]){
            var temp=arr[j];
            arr[j]=arr[j+1];
            arr[j+1]=temp;
	    sorted = true;
        }
    }
    for(let j=arr.length;j > 0; j--){
	if(array[j]<arr[j-1]){
	    var temp=arr[j-1];
       	    arr[j]=arr[j-1];
            arr[j-1]=temp;
	    sotred = true;
	}
    }
    if (!sorted) {
	break;
    }
    }
    return arr;
}


