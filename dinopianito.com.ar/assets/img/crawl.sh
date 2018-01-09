for file in $(curl -s http://dinopianito.com.ar/assets/ |
                  grep href |
                  sed 's/.*href="//' |
                  sed 's/".*//' |
                  grep '^[a-zA-Z].*'); do
    curl -s -O http://dinopianito.com.ar/assets/$file
done