OPBE
====

**O**game **P**robabilistic **B**attle **E**ngine  

Require PHP >= 5.3  


![http://www.phpclasses.org/package/8318-PHP-Ogame-probabilistic-battle-engine.html](http://www.phpclasses.org/award/innovation/nominee.gif)

1. [Introduction](#introduction)
2. [Quick start](#quick-start-installation)
3. [Accuracy](#accuracy)
4. [Performance](#performance)
5. [TestCases](#making-new-test-cases-to-share)
6. [Developers guide](#implementation-developing-guide)
    * [ShipType](#shiptype)
    * [Fleet](#fleet)
    * [Player](#player)
    * [PlayerGroup](#playergroup)
    * [Battle](#battle)
    * [BattleReport](#battlereport)
7. [License](#license)
8. [Questions](#questions)
9. [Who is using OPBE](#who-is-using-opbe)

## Introduction
OPBE is the first (and only) battle engine in the world that uses Probability theory:  
battles are processed very very fast and required little memory resources.  
Also, memory and CPU usage are O(1), this means they are CONSTANT and independent of the ships amount.    

**Features:**
* Multiple players and fleets (ACS)
* Fake targets (Fodder)
* Rapid fire
* Randomic rapid fire with [normal distribution](http://education-portal.com/cimages/multimages/16/Normal_distribution_and_scales.PNG)
* Ordered fires
* Bounce rule
* Waste of damage
* Moon attempt
* Plunder algorithm (resources partition)
* Defenses rebuilt
* Report generated by templates
* Report can be stored as object in database
* Cross-platform (XgProyect,2moons,Xnova,Wootook etc)

**Future features**
* automatic Bcmath detect and usage if needed

---

## Quick start (installation)
This seems so cool! How can I use it?  
You can check in [implementations directory](https://github.com/jstar88/opbe/tree/master/implementations) for your game version,
read the installation.txt file.  
Be sure you have read the *license* with respect for the author.

---

## Accuracy
One of main concepts used in this battle engine is the **expected value**: instead calculate each ship case, OPBE
creates an estimation of their behavior.   
This estimation is improved by analyzing behavior for infinite simulations, so,
to test OPBE's accuracy you have to set speedsim (or dragosim)'s battles amount to a big number, such as 3k.  
Recently was added a feature to simulate a randomic rapid fire, making the combat more realistic.  Anyway you can enable or disable it inside the *constants/battle_constants* file.  
Note: randomic rapid fire will only change the amount of shots,but the way it do is particularly...Infact the deviaton from the mean is made by a special random number generator implementing Gauss algorithm.  
This ensure a [bell curve](http://courses.ttu.edu/rreddick/images/law/bell_curve.gif) of shots close to the ideality.  
Also,the system can be bounded by values that can be setted in the constants/battle_constants* file.

---

## Performance
It seems that noone knows the O() notation, so this is the definition from the Wiki:  
*big O notation is used to classify algorithms by how they respond (e.g., in their processing time or working space requirements) to changes in input size.*   
There are different possibilities, such as O(n) (linear), O(n^2) (quadratic) etc.   
OPBE is O(1) in both CPU and MEMORY usage:    
In practice, that means that the computional requirements to solve an algoritm **don't increase** with the input size.  
It's awesome! You can simulate 20 ships or 20 Tera ships and nothing should change.  
In reality, there is a small difference because the arithmetic operations aren't O(1) for CPU, and also a *double* requires more space than an *integer*.  

Let's do some test:

##### Double's limit test 
Write a lot of nines in both defender's BC and attacker's BC.  
Because of the *double* limit, your number will be trunked to *9223372036854775807*.  
Anyway the battle starts and are calculated as well (some overflow errors maybe).  

    Battle calculated in 2.54 ms.
    Memory used: 335 KB

##### Worst case, OPBE max requirements!
The only thing that requires a lot of memory in OPBE is the Report, because it stores all ships in every round... this means that more   
rounds = more memory.  
Also, the worst case for CPU and memory is to have all types of ships(iteration of them).  
So we set 1'000'000 of ships in each type(defenses only for defender),not a big number just to avoid overflow in calculations.  
And we got:

    Battle calculated in 144.88 ms.
    Memory used: 6249 KB

* These values really depend on your hardware and PHP configuration: expecially, caching the bytecode will decrease a lot the CPU usage but increase RAM usage.

Seems a lot? Try a O(n^2) algorithm and you will crash with insane small amount of ships :)  
Anyway you can decrease a lot the memory usage setting, in *constants/battle_constants.php*,  

```php 
    define('ONLY_FIRST_AND_LAST_ROUND',true);
```

---

## Making new test cases to share
Something wrong with OPBE? The fastest way to share the simulation is to make a test case.  

1. Set your prefered class name,but it must extends **RunnableTest**.
2. Override two functions:
  * *getAttachers()* : return a PlayerGroup that rappresent the attackers
  * *getDefenders()* : return a PlayerGroup that rappresent the defenders

3. Instantiate your class inside the file.
4. Put the file in opbe/test/runnable/

An example:

```php 
<?php
require ("../RunnableTest.php");
class MyTest extends RunnableTest
{
    public function getAttachers()
    {
        $fleet = new Fleet(1,array(
            $this->getShipType(206, 50),
            $this->getShipType(207, 50),
            $this->getShipType(204, 150)));
        $player = new Player(1, array($fleet));
        return new PlayerGroup(array($player));
    }
    public function getDefenders()
    {
        $fleet = new Fleet(2,array(
            $this->getShipType(210, 150),
            $this->getShipType(215, 50),
            $this->getShipType(207, 20)));
        $player = new Player(2, array($fleet));
        return new PlayerGroup(array($player));
    }
}
new MyTest();
?>
```
* You can check the combat result entering with a browser in *opbe/test/runnable/MyTest.php*
* Please use Github issue system

---
## Implementation developing guide 
The system organization is like :
* PlayerGroup
    * Player1
    * Player2
        * Fleet1
        * Fleet2
            * ShipType1
            * ShipType2

So in a PlayerGroup there are different *Player*s,  
each Player have different *Fleet*s,  
each Fleet have different *ShipType*s. 

* All these classes implements Iterator interface, so you can iterate them as arrays.

  ```php
   foreach($playerGroup as $idPlayer => $player)
    {
        foreach($player as $idFleet => $fleet)
        {
            foreach($fleet as $idShipType => $shipType)
            {
                // do something
            }
        }
    }
  ```
  But to increase performace it's better to call *getIterator()* function.

* Another good point is that there aren't side effects in all OPBE classes. This means something like this:

```php
class A
    private $store=array();
    function put($id,$object)
    {
       $this->store[$id] = $object->clone();
    }
    function get($id) 
    {
        return $this->store[$id];    
    }
} 

$a= new A();
$obj = new Object();
$obj->x= "hello";
$a->store(1,$obj);

$obj->x .=" word"; // $object is edited only outside A, no side effects!

echo $a->get(1); // print "hello" instead "hello world"  
```
Sometimes it's not really required to clone, but this good practice ensure less bugs.

#### ShipType

ShipType is the smallest unit in the system: it reppresents a group of specific object type able to fight.  
For some reasons, OPBE needs to categorize it in either one of these two types extending ShipType:
* Defense
* Ship

You shouldn't ened to care about this fact because this automatic code will do it for you:

```php
    $shipType =  $this->getShipType($idShipType, $count);
```    

```php
   
function getShipType($id, $count)
{
    global $CombatCaps, $pricelist;
    $rf = $CombatCaps[$id]['sd'];
    $shield = $CombatCaps[$id]['shield'];
    $cost = array($pricelist[$id]['metal'], $pricelist[$id]['crystal']);
    $power = $CombatCaps[$id]['attack'];
    if ($id >= SHIP_MIN_ID && $id <= SHIP_MAX_ID)
    {
        return new Ship($id, $count, $rf, $shield, $cost, $power);
    }
    return new Defense($id, $count, $rf, $shield, $cost, $power);
}
   
```
- Note that you can assign different technology levels to each ShipType, see functions inside this class.
- By default, ShipType will give tech levels by its Fleet container .   

#### Fleet

Fleet is a group of ShipType and it is extended by a single object 
* HomeFleet : represent the ships and defense in the target's planet

This time you have to manually choose the right class and HomeFleet should have $id = 0;

```php
    $fleet = new Fleet($idFleet); // $idFleet is a must
    $fleet = new HomeFleet(0); // 0 is a must
    $fleet->addShipType($shipType);
```

- Note that you can assign differents techs to each *Fleet*, see functions inside this class.   
- By default, Fleet will give tech levels by its Player container . 
- HomeFleet work as Fleet, but with the difference that is unique: adding more HomeFleet will result on merging them. Feature implemented just for a better report.
- Fleet has a __toString method that automatically fill-up the corrispective *views/fleet.html* and return the result html.   
So you can echo it.

```php
  echo $fleet; 
```

#### Player

Player is a group of Fleets, don't care about the question attacker or defender.

```php
    $player = new Player($idPlayer); // $idPlayer is a must
    $player->addFleet($fleet);
```
- Player has a __toString method that automatically fill-up the corrispective *views/player2.html* and return the result html.   
So you can echo it.

```php
  echo $player; 
```

#### PlayerGroup

PlayerGroup is a group of Player, don't care about the question attacker or defender.

```php
    $playerGroup = new PlayerGroup();
    $playerGroup->addPlayer($player);
```

- PlayerGroup has a __toString method that automatically fill-up the corrispective *views/PlayerGroup.html* and return the result html.   
So you can echo it.

```php
  echo $playerGroup; 
```

#### Bring them together

An easy way to display them:
```php   
    $fleet = new Fleet($idFleet);
    $fleet->addShipType($this->getShipType($id, $count));
    
    $player = new Player($idPlayer);
    $player->addFleet($fleet);
    
    $playerGroup = new PlayerGroup();
    $playerGroup->addPlayer($player);
    
```

#### Battle

Battle is the main class of OPBE.  
The first argument of constructor is the **attacking** PlayerGroup, the second one is the **defending** PlayerGroup.  

There are two methods you need to know about:
* startBattle(boolean $debug) : start the battle, if $debug == true, informations will be written in output.
* getReport() : return an object useful to retrieve all kinds of battle information.


```php
    $engine = new Battle($attackingPlayerGroup, $defendingPlayerGroup);
    $engine->startBattle(false);
    $info = $engine->getReport();
```

#### BattleReport

BattleReport is a big container of data about the simulated battle.  
In the web interface of OPBE, the instance of BattleReport is injected in templates.   

```php
    $info = $engine->getReport();
```

- BattleReport contains all the ships status in every round, and also has useful functions to fill templates or update  
the database after the battle.
- BattleReport has a __toString method that automatically fill-up the corrispective *views/report.html* and return the result html.   
So you can echo it.

```php
   echo $info; 
```

This is very usefull to store only the object in database and generate the html when needed. For example:

```php
    $obj = serialize($info);
    mysql_query("INSERT INTO Reports (id , obj) VALUES ($id, $obj)");
    
    $result = mysql_fetch_array(mysql_query("SELECT obj FROM Reports WHERE id = $id"));    
    $info = unserialize($result['obj']);
    echo $info;
```

---

## License

![license](http://www.gnu.org/graphics/agplv3-155x51.png)  
    
    Copyright (C) 2013  Jstar

    OPBE is free software: you can redistribute it and/or modify
    it under the terms of the GNU Affero General Public License as
    published by the Free Software Foundation, either version 3 of the
    License, or (at your option) any later version.

    OPBE is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU Affero General Public License for more details.

    You should have received a copy of the GNU Affero General Public License
    along with this program.  If not, see <http://www.gnu.org/licenses/>.
    
[why affero GPL](http://www.gnu.org/licenses/why-affero-gpl.html)

---

## Questions

> I would like to include your battle engine but the code of my game won't be published

You can keep secret your code because OPBE can be seen as a external module with own license, it's only required to share changes on OPBE.

> I would like to have some profits with my game 

GNU affero v3 accepts profits as well

> I would like use OPBE with numbers greater than double

You should replace any PHP native mathematical with [BC math](http://php.net/manual/en/ref.bc.php) functions

> I would like change ships/defense repair probability

```php
    You have to change only constats/battle_constants.php  
    define('DEFENSE_REPAIR_PROB', 0.7); // 0.7 = 70%
    define('SHIP_REPAIR_PROB', 0);
```
---
    

## Who is using OPBE?

I'm happy to deliver this software giving others the possibility to have a good battle engine.  
On the other hand, it's a pleasure to see people using my OPBE.  
[update] Please do not send email, instead use github's private messages

![xgproyect](http://www.xgproyect.org/images/misc/xg-logo.png)

