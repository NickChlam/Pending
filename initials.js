function convertInitials(name){
        var initials; 
        var posLastName;

        posLastName = name.indexOf(' ');

        initials = name.charAt(0) + '.' + name.charAt(posLastName + 1)

    return initials.toUpperCase();
}

console.log(convertInitials('Nick Chlam'));

