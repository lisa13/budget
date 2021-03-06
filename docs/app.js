//BUDGET CONTROLLER
var budgetController = (function () {

    var Expense = function (id, description, value) {
        this.id = id;
        this.description = description;
        this.value = value;
        this.percentage = -1;
    };


    Expense.prototype.calcPercentage = function (totalIncome) {

        if (totalIncome > 0) {
            this.percentage = Math.round((this.value / totalIncome) * 100);
        } else {
            this.percentage = -1;
        }
    };


    Expense.prototype.getPercentage = function () {
        return this.percentage;
    };


    var Income = function (id, description, value) {
        this.id = id;
        this.description = description;
        this.value = value;
    };


    var calculateTotal = function (type) {
        var sum = 0;
        data.allItems[type].forEach(function (cur) {

            sum += cur.value;
        });
        data.totals[type] = sum;
    }


    var data = {
        allItems: {
            exp: [],
            inc: []
        },
        totals: {
            exp: 0,
            inc: 0
        },
        budget: 0,
        percentage: -1
    };


    return {
        addItem: function (type, des, val) {
            var newItem, ID;

            if (data.allItems[type].length > 0) {
                ID = data.allItems[type][data.allItems[type].length - 1].id + 1;
            } else {
                ID = 0;
            }

            // Create new item based on 'inc' or 'exp' type
            if (type === 'exp') {
                newItem = new Expense(ID, des, val);
            } else if (type === 'inc') {
                newItem = new Income(ID, des, val);
            }

            // Push it into our data structure
            data.allItems[type].push(newItem);

            // Return the new element
            return newItem;
        },


        deleteItem: function (type, id) {
            var ids, index;
            console.log('in delte item')

            ids = data.allItems[type].map(function (current) {
                return current.id;
            });
            index = ids.indexOf(id);

            if (index !== -1) {
                data.allItems[type].splice(index, 1);
            }
        },


        calculatBudget: function () {
            //calculat total income and expenses
            calculateTotal('exp');
            calculateTotal('inc');

            //calculate the budged: income - expenses
            data.budget = data.totals.inc - data.totals.exp;

            //calculate the percentage of the income
            //expense= 100 income = 300, spent 33.333% = 100/300 * 100
            if (data.totals.inc > 0) {
                data.percentage = Math.round((data.totals.exp / data.totals.inc) * 100);
            } else {
                data.percentage = -1
            };
        },


        calculatePercentages: function () {
            data.allItems.exp.forEach(function (cur) {
                cur.calcPercentage(data.totals.inc);
            });
        },


        getPercentage: function () {
            var allPerc = data.allItems.exp.map(function (cur) {
                return cur.getPercentage();
            });

            return allPerc;
        },


        getBudget: function () {

            return {
                budget: data.budget,
                totalInc: data.totals.inc,
                totalExp: data.totals.exp,
                percentage: data.percentage
            }
        },

        testing: function () {
            console.log(data);
        }
    };
})();


//UI CONTROLLER
// these are two standalone controllers they don't communicate and are unaware fo each other
var UIController = (function () {

    var DOMstrings = {
        inputTypes: '.add__type',
        inputDescritpion: '.add__description',
        inputValue: '.add__value',
        addBtn: '.add__btn',
        incomeContainer: '.income__list',
        expensesContainer: '.expenses__list',
        budgetLabel: '.budget__value',
        incomeLable: '.budget__income--value',
        expensLabel: '.budget__expenses--value',
        percentageLabel: '.budget__expenses--percentage',
        container: '.container',
        expensesPercLabel: '.item__percentage',
        dateLabel: '.budget__title--month'
    };


    var formatNumber = function (num, type) {
        var numSplit, int, dec, type;

        //returns the absolute value
        num = Math.abs(num);
        //2.35.toFixed(1);        // Returns '2.4'. Note it rounds up
        num = num.toFixed(2);
        numSplit = num.split('.');
        int = numSplit[0];
        if (int.length > 3) {
            int = int.substr(0, int.length - 3) + ',' + int.substr(int.length - 3, 3); //input 23510 output 23,510
        }
        dec = numSplit[1];

        return (type === 'exp' ? "-" : "+") + ' ' + int + '.' + dec;
    };

    var nodeListFor = function (list, callBack) {
        for (var i = 0; i < list.length; i++) {
            callBack(list[i], i);
        }
    };

    return {
        getInput: function () {
            return {
                type: document.querySelector(DOMstrings.inputTypes).value,
                description: document.querySelector(DOMstrings.inputDescritpion).value,
                value: parseFloat(document.querySelector(DOMstrings.inputValue).value)
            };
        },

        addLisatItem(obj, type) {
            var html, newHtml, element;

            //create html with placeholder text
            if (type === 'inc') {
                element = DOMstrings.incomeContainer;
                html = '<div class="item clearfix" id="inc-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>'

            } else if (type === 'exp') {
                element = DOMstrings.expensesContainer;
                html = '<div class="item clearfix" id="exp-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"> <button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button> </div></div> </div>'
            }

            //replace the placeholder with the actual data
            newHtml = html.replace('%id%', obj.id);
            newHtml = newHtml.replace('%description%', obj.description);
            newHtml = newHtml.replace('%value%', formatNumber(obj.value, type));

            //insert html into the dom
            document.querySelector(element).insertAdjacentHTML('beforeend', newHtml);

        },

        deleteListItem: function (selectorID) {
            console.log('in delte LIST item')

            var el = document.getElementById(selectorID);
            el.parentNode.removeChild(el);
        },

        clearFields() {
            var fields, fieldsArr;

            fields = document.querySelectorAll(DOMstrings.inputDescritpion + ',' + DOMstrings.inputValue + ',' + DOMstrings.inputType);
            fieldsArr = Array.prototype.slice.call(fields);

            fieldsArr.forEach(function (current, index, array) {
                current.value = "";
            });

            fieldsArr[0].focus();
        },

        displayBudget: function (obj) {
            var type;

            obj.budet > 0 ? type = 'inc' : type = 'exp';

            document.querySelector(DOMstrings.budgetLabel).textContent = formatNumber(obj.budget, type);
            document.querySelector(DOMstrings.incomeLable).textContent = formatNumber(obj.totalInc, 'inc');
            document.querySelector(DOMstrings.expensLabel).textContent = formatNumber(obj.totalExp, 'exp');
            if (obj.percentage > 0) {
                document.querySelector(DOMstrings.percentageLabel).textContent = obj.percentage + '%';
            } else {
                document.querySelector(DOMstrings.percentageLabel).textContent = '---';
            }
        },


        displayPercentages: function (percentages) {
            var fields = document.querySelectorAll(DOMstrings.expensesPercLabel);


            nodeListFor(fields, function (current, index) {
                if (percentages[index] > 0) {
                    current.textContent = percentages[index] + '%';
                } else {
                    current.textContent = '---';
                }
            });
        },

        displayMonth: function () {

            var now, year, month, months;

            now = new Date();

            months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November'];
            month = now.getMonth();
            //getFullYear is a date method
            year = now.getFullYear();
            document.querySelector(DOMstrings.dateLabel).textContent = year + ' ' + months[month];
        },


        changedType: function () {

            var fields = document.querySelectorAll(
                DOMstrings.inputValue  + ',' + DOMstrings.inputDescritpion + ',' + DOMstrings.inputTypes
            );

            nodeListFor(fields, function (current) {
                current.classList.toggle('red-focus');
            });

            document.querySelector(DOMstrings.addBtn).classList.toggle('red');

        },


        getDomstrings: function () {
            return DOMstrings;
        }
    };

})();


//GLOBAL APP CONTROLLER
var controller = (function (budgetCtrl, UICtrl) {

    var setupEvnList = function () {
        var DOM = UIController.getDomstrings();

        document.querySelector(DOM.addBtn).addEventListener('click', ctrlAddItem);
        //Anywhere clicked on the document this function will fire
        document.addEventListener('keypress', function (event) {
            //some older browsers use which instead keycode so we cover both cases
            if (event.keyCode === 13 || event.which === 13) {
                ctrlAddItem();
            }
        });

        document.querySelector(DOM.container).addEventListener('click', ctrlDeleteItem);
        document.querySelector(DOM.inputTypes).addEventListener('change', UICtrl.changedType);
    };

    var updateBudget = function () {
        //calculate the budget
        budgetCtrl.calculatBudget();
        //retunr budget
        var budget = budgetCtrl.getBudget();
        //display the budget on the UI
        UICtrl.displayBudget(budget);

    };

    var updatePercentages = function () {
        //calculate the percentage
        budgetCtrl.calculatePercentages();
        //read it from the budgetCtrl
        var percentages = budgetCtrl.getPercentage();
        //update the UI
        UICtrl.displayPercentages(percentages);
    };

    var ctrlAddItem = function () {
        var input, newItem;

        // 1. Get the field input data
        input = UICtrl.getInput();

        if (input.description !== '' && !isNaN(input.value) && input.value > 0) {

            // 2. Add the item to the budget controller
            newItem = budgetCtrl.addItem(input.type, input.description, input.value);

            // 3. Add the item to the UI
            UICtrl.addLisatItem(newItem, input.type);

            //4 clear fields after entering the inpiut
            UICtrl.clearFields();

            //update and show the new budget
            updateBudget();

            //calculat and update percentages
            updatePercentages();
        }
    };

    var ctrlDeleteItem = function (event) {
        // console.log(event.target); use this to find the targeted element


        var itemId = event.target.parentNode.parentNode.parentNode.parentNode.id;
        console.log(itemId);
        if (itemId) {
            //inc-1
            var splitId = itemId.split('-');
            var type = splitId[0];
            var ID = parseInt(splitId[1]);

            //delete the item from the data strucutre
            budgetCtrl.deleteItem(type, ID);
            //delete the item from UI
            UICtrl.deleteListItem(itemId);

            //update and show the new budget
            updateBudget();

            //calculat and update percentages
            updatePercentages();
        }

        console.log('in the maim')
    };

    return {
        init: function () {
            console.log("the app ran");
            UICtrl.displayMonth();
            UICtrl.displayBudget({
                budget: 0,
                totalInc: 0,
                totalExp: 0,
                percentage: -1
            });
            setupEvnList();
        }
    }

})(budgetController, UIController);

controller.init();