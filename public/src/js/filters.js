'use strict';

angular.module('lisk_explorer')
  .filter('approval', function () {
      return function (votes) {
          if (isNaN(votes)) {
              return 0;
          } else {
              return ((parseInt(votes) / 1009000000000000) * 100).toFixed(2);
          }
      };
  })
  .filter('epochStamp', function () {
      return function (d) {
          return new Date(
              (((Date.UTC(2016, 4, 24, 17, 0, 0, 0) / 1000) + d) * 1000)
          );
      };
  })
  .filter('forgingTime', function () {
      return function (seconds) {
        if (seconds === 0) {
          return 'Now!';
        }
        var minutes = Math.floor(seconds / 60);
        seconds = seconds - (minutes * 60);
        if (minutes && seconds) {
          return minutes + ' min ' + seconds + ' sec';
        } else if (minutes) {
          return minutes + ' min ';
        } else {
          return seconds + ' sec';
        }
      };
  })
  .filter('fiat', function () {
      return function (amount) {
          if (isNaN(amount)) {
              return (0).toFixed(2);
          } else {
              return (parseInt(amount) / 100000000).toFixed(2);
          }
      };
  })
  .filter('lisk', function () {
      return function (amount) {
          if (isNaN(amount)) {
              return (0).toFixed(8);
          } else {
              return (parseInt(amount) / 100000000).toFixed (8).replace (/\.?0+$/, '');
          }
      };
  })
  .filter('currency', function (numberFilter, liskFilter) {
      return function (amount, currency, decimal_places) {
        var lisk = liskFilter (amount),
            factor = 1;

        if (currency.tickers && currency.tickers.RISE && currency.tickers.RISE[currency.symbol]) {
          factor = currency.tickers.RISE[currency.symbol];
        } else if (currency.symbol !== 'RISE') {
          // Exchange rate not available for current symbol
          return 'N/A';
        }

        if (decimal_places === undefined) {
          switch (currency.symbol) {
            case 'RISE':
            case 'BTC':
              return numberFilter ((lisk * factor), 8).replace (/\.?0+$/, '');
            default:
              return numberFilter ((lisk * factor), 2).replace (/\.?0+$/, '');
          }
        } else {
          return numberFilter ((lisk * factor), decimal_places);
        }
      };
  })
  .filter('nethash', function () {
      return function (nethash) {
          if (nethash === 'e90d39ac200c495b97deb6d9700745177c7fc4aa80a404108ec820cbeced054c') {
              return 'Testnet';
          } else if (nethash === 'cd8171332c012514864edd8eb6f68fc3ea6cb2afbaf21c56e12751022684cea5v')  {
              return 'Mainnet';
          } else {
              return 'Local';
          }
      };
  })
  .filter('round', function () {
      return function (height) {
          if (isNaN(height)) {
              return 0;
          } else {
              return Math.floor(height / 101) + (height % 101 > 0 ? 1 : 0);
          }
      };
  })
  .filter('split', function () {
      return function (input, delimiter) {
          delimiter = delimiter || ',';
          return input.split(delimiter);
      };
  })
  .filter('startFrom', function () {
      return function (input, start) {
          start = +start;
          return input.slice(start);
      };
  })
  .filter('supplyPercent', function () {
      return function (amount, supply) {
        var supply_check = (supply > 0);
          if (isNaN(amount) || !supply_check) {
            return (0).toFixed(2);
          }
          return (amount / supply * 100).toFixed(2);
      };
  })
  .filter('timeAgo', function (epochStampFilter) {
      return function (timestamp) {
          return moment(epochStampFilter(timestamp)).fromNow();
      };
  })
  .filter('timeSpan', function (epochStampFilter) {
      return function (a, b) {
          return moment.duration(
              epochStampFilter(a) - epochStampFilter(b)
          ).humanize();
      };
  })
  .filter('timestamp', function (epochStampFilter) {
      return function (timestamp) {
          var d     = epochStampFilter(timestamp);
          var month = d.getMonth() + 1;

          if (month < 10) {
              month = '0' + month;
          }

          var day = d.getDate();

          if (day < 10) {
              day = '0' + day;
          }

          var h = d.getHours();
          var m = d.getMinutes();
          var s = d.getSeconds();

          if (h < 10) {
              h = '0' + h;
          }

          if (m < 10) {
              m = '0' + m;
          }

          if (s < 10) {
              s = '0' + s;
          }

          return d.getFullYear() + '/' + month + '/' + day + ' ' + h + ':' + m + ':' + s;
      };
  })
  .filter('txSender', function () {
      return function (tx) {
          return ((tx.senderDelegate && tx.senderDelegate.username) || tx.senderUsername || (tx.knownSender && tx.knownSender.owner) || tx.senderId);
      };
  })
  .filter('address', function () {
      return function (a) {
          return (a.username || (a.knowledge && a.knowledge.owner) || a.address);
      };
  })
  .filter('txRecipient', function (txTypes) {
      return function (tx) {
          if (tx.type === 0) {
              return ((tx.recipientDelegate && tx.recipientDelegate.username) || tx.recipientUsername || (tx.knownRecipient && tx.knownRecipient.owner) || tx.recipientId);
          } else {
              return (txTypes[parseInt(tx.type)]);
          }
      };
  })
  .filter('txType', function (txTypes) {
      return function (tx) {
          return txTypes[parseInt(tx.type)];
      };
  })
  .filter('votes', function () {
      return function (a) {
          return (a.username || (a.knowledge && a.knowledge.owner) || a.address);
      };
  }).filter('proposal', function ($sce) {
      return function (name, proposals) {
          var p = _.find (proposals, function (p) {
              return p.name === name.toLowerCase ();
          });
          if (p) {
              return $sce.trustAsHtml('<a class="glyphicon glyphicon-user" href="https://forum.lisk.io/viewtopic.php?f=48&t=' + p.topic + '" title="' + _.escape (p.description) + '" target="_blank"></a> ' + name);
          } else {
              return $sce.trustAsHtml(name);
          }
      };
  });
