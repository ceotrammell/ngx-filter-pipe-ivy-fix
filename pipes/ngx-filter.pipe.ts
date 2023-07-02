import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
    name: 'filterBy',
})
export class FilterPipe implements PipeTransform {
    static isFoundOnWalking(value: any, key: any): boolean {
        let walker = value;
        let found = false;
        do {
            if (walker.hasOwnProperty(key) || Object.getOwnPropertyDescriptor(walker, key)) {
                found = true;
                break;
            }
        } while (walker = Object.getPrototypeOf(walker));
        return found;
    }

    static isNumber(value: any): boolean {
      return !isNaN(parseInt(value, 10)) && isFinite(value);
    }

    static getValue(value: any): any {
      return typeof value === 'function' ? value() : value;
    }

    private filterByString(filter: any) {
        if (filter) {
            filter = filter.toLowerCase();
        }
        return function (value) {
            return !filter || (value ? ('' + value).toLowerCase().indexOf(filter) !== -1 : false);
        };
    }

    private filterByBoolean(filter: any) {
      return function (value) { return Boolean(value) === filter; };
    }

    private filterByObject(filter: any) {
      var _this = this;
      return function (value) {
        for (var key in filter) {
          if (key === '$or') {
            if (!_this.filterByOr(filter.$or)(FilterPipe.getValue(value))) {
              return false;
            }
            continue;
          }
          if (!value || !FilterPipe.isFoundOnWalking(value, key)) {
            return false;
          }
          if (!_this.isMatching(filter[key], FilterPipe.getValue(value[key]))) {
            return false;
          }
        }
        return true;
      };
    }

    private isMatching(filter: any, val: any) {
      switch (typeof filter) {
        case 'boolean':
            return this.filterByBoolean(filter)(val);
        case 'string':
            return this.filterByString(filter)(val);
        case 'object':
            return this.filterByObject(filter)(val);
    }
    return this.filterDefault(filter)(val);
    }

    private filterByOr(filter: any) {
      var _this = this;
      return function (value) {
          var /** @type {?} */ length = filter.length;
          var /** @type {?} */ arrayComparison = function (i) { return value.indexOf(filter[i]) !== -1; };
          var /** @type {?} */ otherComparison = function (i) { return _this.isMatching(filter[i], value); };
          var /** @type {?} */ comparison = Array.isArray(value) ? arrayComparison : otherComparison;
          for (var /** @type {?} */ i = 0; i < length; i++) {
              if (comparison(i)) {
                  return true;
              }
          }
          return false;
      };    }

    private filterDefault(filter: any) {
      return function (value) { return filter === undefined || filter == value; };
    }

    transform(array: any[], filter: any): any {
      if (!array) {
        return array;
    }
    switch (typeof filter) {
        case 'boolean':
            return array.filter(this.filterByBoolean(filter));
        case 'string':
            if (FilterPipe.isNumber(filter)) {
                return array.filter(this.filterDefault(filter));
            }
            return array.filter(this.filterByString(filter));
        case 'object':
            return array.filter(this.filterByObject(filter));
        case 'function':
            return array.filter(filter);
    }
    return array.filter(this.filterDefault(filter));
    }
}
