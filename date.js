exports.getDate = function () {
    const today = new Date();
    const currentDay = today.getDay();
    const weekDays = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const options = {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric", 
    };
    return today.toLocaleDateString("en-US", options);
}

exports.getDay = function () {
    const today = new Date();
    const currentDay = today.getDay();
    const weekDays = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const options = {
        weekday: "long", 
    };
    return today.toLocaleDateString("en-US", options);
}

