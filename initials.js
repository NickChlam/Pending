function convertInitials(name){
        var initials; 
        var posLastName;

        posLastName = name.indexOf(' ');

        initials = name.charAt(0) + '.' + name.charAt(posLastName + 1)

    return initials.toUpperCase();
}

function HowMuchToBill(num){
    if(num < 135000){
        return num / .30;
    }
    else{
        let i = 135000 * .30;
        let Tier2 = (num - 135000)  * .40
        return i + Tier2;

    }
}

function doubleSomething(amount, length){
     

    while(length != 0){
        amount = amount*2;
        length = length -1;

    }
    return amount
}

console.log(HowMuchToBill(200000));
console.log(doubleSomething(1, 30))
