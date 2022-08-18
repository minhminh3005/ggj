## Search parameters

|                  | param | type                          | note                                                                                                  |
|------------------|-------|-------------------------------|-------------------------------------------------------------------------------------------------------|
| keyword          | q     | text                          | maxLength=200                                                                                         |
| product status   | ps    | onSale                        | ex: ps=onSale, pending,...                                                                            |
| category         | pc    | category_id                   | ex: pc=1,2,3,4,...                                                                                    |
| price range      | pp    | number,number                 | value in range [500, 5000, 10000, 30000, 50000, 100000, 100001]                                       |
| delivery days    | pd    | 1we <br>1mo <br>3mo <br>ab3mo |                                                                                                       |
| rating           | pr    | 2<br>3<br>4<br>4.5            |                                                                                                       |
| sort             | po    | ro<br>na<br>hs<br>hr          | ro: Recommended order おすすめ順 <br>na: New arrival 新着<br>hs: Hot selling 売れ筋<br>hr: Highly acclaimed 高評伍 |
| product discount | pdc   | 1 <br>0 (default)             | saleOff is not develop in this phase (4/15/2022)                                                      |
