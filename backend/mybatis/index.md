## 1. Mybatis概述

是一款优秀的持久层 半自动ORM 框架，它支持定制化SQL、存储过程以及高级映射。

MyBatis避免了几乎所有的JDBC代码和手动设置参数以及获取结果集。

MyBatis可以使用简单的XML或注解来配置和映射原生信息，将接口和Java的POJO（普通的Java对象）映射成数据库中的记录。

Configration会去找全局配置文件，然后sesssion工厂去找sqlsession。

Sqlsession就是myBatis中最核心的了。它去加载mappedStatment。然后去执行TransAction。

## 2. Mybatis快速入门

创建SpringBoot项目

引入依赖

```java
<dependency>
    <groupId>org.mybatis.spring.boot</groupId>
    <artifactId>mybatis-spring-boot-starter</artifactId>
    <version>2.1.4</version>
 </dependency>
 <dependency>
    <groupId>mysql</groupId>
    <artifactId>mysql-connector-java</artifactId>
    <scope>runtime</scope>
</dependency>
```

在application.properties中配置数据库连接参数

```java
spring.datasource.driver-class-name=com.mysql.cj.jdbc.Driver
spring.datasource.url=jdbc:mysql://localhost:3306/jdbcDemo
spring.datasource.username=root
spring.datasource.password=123456
```

创建实体类com/whitecamellia/entity/Person，并创建相应的数据库表

```java
public class Person {
    private Integer id;
    private String name;
    private Integer age;
    // getters and setters
}
```

创建com/whitecamellia/mapper接口

```java
@Mapper
public interface PersonMapper {
    List<Person> findAll();
}
```

resources中添加映射文件com.whitecamellia.mapper.PersonMapper.xml

```java
<?xml version="1.0" encoding="UTF-8" ?>
<!DOCTYPE mapper PUBLIC "-//mybatis.org//DTD Mapper 3.0//EN" "http://mybatis.org/dtd/mybatis-3-mapper.dtd" >
<mapper namespace="com.whitecamellia.mapper.PersonMapper">
   <select id="findAll" resultType="com.whitecamellia.entity.Person">
        select *
        from person
    </select>
</mapper>
```

测试

```java
package com.whitecamellia;

import com.whitecamellia.entity.Person;
import com.whitecamellia.mapper.PersonMapper;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import java.util.List;

@SpringBootTest
class MybatisDemoApplicationTests {
 @Autowired
    private PersonMapper personMapper;

    @Test
    void contextLoads() {
        List<Person> list = personMapper.findAll();
        for (Person person : list) {
            System.out.println(person);
        }
    }
}

```

## 3. statement详解

Mybatis的核心是SQL，一个statement代表着一个SQL，因此，statement的配置即是我们通过Mybatis操作数据库的核心。

statement分为四个标签：`<insert>`、`<delete>`、`<update>`、`<select>`，分别代表对数据的增删改查。

标签中定义的便是原生的SQL语句，需要新掌握的是标签上的属性：

id

每个statement都有，且为必选属性，id为statement提供唯一标识，以保证该statement可以被成功定位并执行。不能重复。

resultType

只有select语句有该属性，代表SQL返回结果的类型，查询用户可以指定为entity.Person类型

比如查询数据总条数，可以指定resultType为long类型，

```java
<select id="findAll" resultType="com.whitecamellia.entity.Person">
        select *
        from person
    </select>
    <select id="selectTotal" resultType="java.lang.Integer">
        select count(*)
        from person
    </select>
```

parameterType

如果SQL中需要传入参数，则可以通过该属性指定参数类型，如果不指定，Mybatis会自动判断，因此该属性没有实质作用。

```java
 <select id="findById" parameterType="int" resultType="com.whitecamellia.entity.Person">
        select *
        from person
        where id = #{id}
   </select>
```

parameterType指定是什么数据类型，但是Mybatis会自动判断，故可以省略
resultMap

只有select语句有，当SQL结果集不能自动映射到实体类属性时使用，

比如数据库字段为person_id，而Person类中属性为personId，此时Mybatis不能自动映射，需要手动映射。

以下为实例，id标签指定主键属性，result标签指定普通属性，column属性对应表中字段名，

property属性对应类中属性名，autoMapping自动映射。可选

```java
 <resultMap id="personMap" type="com.whitecamellia.entity.Person" autoMapping="true">
        <id property="id" column="id"></id>
        <!--        <result property="age" column="age"></result>-->
        <!--        <result property="name" column="name"></result>-->
        <result property="loveColor" column="love_color"></result>
    </resultMap>
 
    <select id="findAll" resultMap="personMap">
        select *
        from person
    </select>
```

insert插入

```java
<insert id="insert">
    insert into person(id,name,age,love_color)
     values
    (null,"zl",26,"紫色")
</insert>
```

update更新

```java
<update id="updateById">
    update person
    set name ='petrel'
    where id = 203
</update>
```

delete删除

```java
<delete id="deleteById">
        delete
        from person
        where id = 204
</delete>
```

传入的参数可以有多种类型

基本类型（ int，String，double，long，date……） 在SQL中获取这类请求参数可以使用#{}表达式，{}中可以填任意字符串，但应该保证可读性，比如：

```java
<select id="findAllById" resultType="com.whitscamellia.entity.Person">
        select * from person where id = #{ids}
</select>
```

#{ids} 内部名字id自定义，只是一个占位符
但是也可以指定参数

```java
List<Person> selectByAge(@Param("age1") int a, @Param("age2") int b);
```

```java
<select id="selectByAge" resultMap="personMap">
        select *
        from person
        where age >= #{age1}
          and age <= #{age2}
    </select>
```

POJO 即传入实体类，比如一个Person：

```java
<insert id="insert" parameterType="com.whitecamellia.entity.Person">
        insert into person (id, name, age, love_color)
        values (null, #{name}, #{age}, #{loveColor})
    </insert>
```

注意#{内部字段名是POJO实体类的成员变量名称}

多个参数传递问题 其中有一个参数时java对象，我们需要指定时对象的哪项属性，防止与其他类型参数进行混淆

```java
int i = personMapper.updateById(1, person);
```

```java
  <update id="updateById">
        update person
        set name       = #{person.name},
            age        = #{person.age},
            love_color = #{person.loveColor}
        where id = #{id}
 
 </update> 
```

## 4.配置：

mybatis的settings配置很丰富：

别名	映射的类型

```java
_byte	byte
_long	long
_short	short
_int	int
_integer	int
_double	double
_float	float
_boolean	boolean
string	String
byte	Byte
long	Long
short	Short
int	Integer
integer	Integer
double	Double
float	Float
boolean	Boolean
date	Date
decimal	BigDecimal
bigdecimal	BigDecimal
```

自定义别名：

使用Mapper代理的形式开发，需要编写Mapper接口

要么使用@Mapper接口标注在每一个Mapper接口上。

要么在启动类上使用@MapperScan(basePackages = "com.whitecamellia.mapper")进行全包扫描。

编写Mapper接口对应的xml映射文件。注意：映射文件目录要与Mapper接口包对应

可以在启动类上添加注解，来批量扫描Mapper接口，从而避免使用@Mapper注解。

```java
@SpringBootApplication
@MapperScan(basePackages = "com.whitecamellia.mapper")
public class MybatisDemoApplication {
 
    public static void main(String[] args) {
 
        SpringApplication.run(MybatisDemoApplication.class, args);
    }
 
}
```

Spring Boot项目默认使用logback作为日志框架，可以设置日志等级来输出更多信息，比如Mybatis所执行的SQL

logging.level.com.whitecamellia.mybatis_demo=debug
Spring Boot项目指定映射文件路径(指定resource根目录下mapper中的所有Mapper.xml文件)

mybatis.mapper-locations=classpath:mapper/*Mapper.xml
Mybatis中的配置都可以在application.properties中完成，包括数据库连接池的配置、驼峰配置、别名配置等。

```java
mybatis.configuration.map-underscore-to-camel-case=true
<select id="findAll" resultType="com.whitecamellia.entity.Person">
        select *
        from person
 </select>
// 可以不必再指定resultMap

mybatis.type-aliases-package=com.whitecamellia.entity
<select id="findAll" resultType="person">
        select *
        from person
 </select>
主键返回(useGeneratedKeys)

mybatis.configuration.use-generated-keys=true
package com.whitecamellia.entity;
public class Cat {
    private String id;
    private String name;
    private Integer pId;
 
   getter&&setter
 
}
<!--   personMapper-->
<insert id="insert" useGeneratedKeys="true" keyProperty="id">
        insert into person (id, name, age, love_color)
        values (null, #{name}, #{age}, #{loveColor})
  </insert>
public interface CatMapper {
    int insert(Cat cat);
}
<!--    catMapper-->
  <insert id="insert">
        insert into cat (id, name, p_id)
        values (#{id}, #{name}, #{pId})
 </insert>
 @Test
    void insertCat() {
        Person person = new Person();
        person.setId(null);
        person.setName("王一猫");
        person.setAge(20);
        person.setLoveColor("黄色");
        personMapper.insert(person);
        Cat cat = new Cat();
        cat.setId(null);
        cat.setName("大黄");
        cat.setpId(person.getId());
        catMapper.insert(cat);
    }
```

## 5. 动态SQL

什么是动态sql Mybatis可以通过语法的判断对sql进行灵活封装，拼接。

需求：

没有条件，select * from person

查询id=1的姓名 select * from person where id = 1

查询name=zs的姓名 select * from person where name = ‘’zs“

查询id=1的并age=23的。select * from person where id = 1 and age = 23

会发现我们需要写很多种可能的sql语句。不灵活

动态sql就是解决这个问题的。

if标签和where标签

```java
<select id="find" resultType="com.whitecamellia.entity.Person">
        select *
        from person
        <where>
            <if test="id!=null">
                and id = #{id}
            </if>
            <if test="name!=null and name != ''">
                and name = #{name}
            </if>
            <if test="age!=null">
                and age = #{age}
            </if>
            <if test="loveColor!=null">
                and love_color liKe "%"#{loveColor}"%"
            </if>
        </where>
    </select>
```

注意：
1.like这块 的字符拼接如下两种方式都可以，
and love_color liKe "%"#{loveColor}"%" 推荐使用这种方式
and love_color liKe "%${loveColor}%"  但是$的形式，是字符串拼接的，会出现sql注入问题。
2.注释使用xml的注释，不能使用sql语句注释

```java
public interface PersonMapper {
 ...
     List<Person> find(Person person);
...
}
```

测试：

```java
    PersonMapper mapper = sqlSession.getMapper(PersonMapper.class);
 
    //我们可以选择性的按照条件查询可以根据id或者name，或者color
    Person person = new Person();
    //person.setId(1);
    person.setName("张三");
    person.setLovecolor("红色");
    List<Person> byColor = mapper.findByColor(person);
    System.out.println(byColor);
}
 
  @Test
    void find() {
       //我们可以选择性的按照条件查询可以根据id或者name，或者color
        Person person = new Person();
        person.setId(1);
        person.setName("李四");
        person.setLoveColor("色");
        List<Person> persons = personMapper.find(person);
        for (Person human : persons) {
            System.out.println(human);
        }
    }
```

sql片段 sql片段可以让程序员写的sql使用率更高，也就是说可重用性更高。

可以用sql标签定义一些必须查询列，提取出来。然后用include标签引入

```java
<sql id="all">
        id
        ,name,age
</sql>
 
<select id="findAll" resultMap="personMap">
        select
        <include refid="all"/>
        ,love_color
        from person
 </select>
```

foreach标签

删除：delete

写法一：

```java
<delete id="deleteByIds">
   
            <!-- collection:指定输入集合或者数组的参数名称 集合就是list。数组就是array -->
            <!-- item:声明遍历出的参数变量 -->
            <!-- open:遍历开始时需要拼接的内容 -->
            <!-- close:遍历结束时需要拼接的内容 -->
            <!-- separator:遍历出的参数变量之间需要拼接的参数 ，delete from person where id in ( 1，2，3)-->
        delete from person where id in (
        <foreach collection="array" item="deleteid" separator=",">
            ${deleteid}
        </foreach>
        )
    </delete>
```

写法二：

```java
<delete id="deleteByIds">
        delete from person
        <foreach collection="array" item="deleteid" open="where id in (" close=")" separator=",">
            ${deleteid}
        </foreach>
    </delete>
 
混合判断：delete from person where id in (1,2)
<delete id="deleteByIds">
    delete from person
    <where>
        <if test="list!=null and list.size>0">
            <foreach collection="list" item="id" open="and id in ( " close=" ) " separator=",">
                #{id}
            </foreach>
        </if>
        <if test="list==null or list.size==0">
            and 1d = 2
        </if>
    </ where>
</delete>
public interface PersonMapper {
      //批量删除  根据ids批量删除数据
      public int deleteByIds(Integer[] ids);
  }
```

set标签

相当于update的set关键字，会帮我们去掉最后一个逗号

更新：update

```java
<update id="update">
        update person
        <set>
            <if test="person.name!=null">
                name = #{person.name},
            </if>
            <if test="person.age!=null">
                age = #{person.age},
            </if>
            <if test="person.loveColor!=null">
                love_color = #{person.loveColor},
            </if>
        </set>
        where id = #{id}
 
    </update>
```

```java
 @Test
    void updateById() {
        Person person = new Person();
        person.setName("小红");
        person.setAge(20);
        person.setLoveColor("红色");
        personMapper.update(2, person);
    }
 
  
 
public interface PersonMapper {
      //根据id 修改信息
      int update(int id, Person person);
  }
```

传递多个参数问题

```java
<update id = "update">
  update person 
  <set>
    	<if test="person.name!=null">
  	  name = #{person.name},
  		<if test="person.age!=null">
  	  name = #{person.age},
  	  <if test="person.loveColor!=null">
  	  love_color = #{person.loveColor},
  </set>
  where id = #{id}
</update>
```

## 6. 多表映射

需求一
需求：查询订单信息，关联查询购买该订单的用户信息。

需求：查询订单信息，关联查询购买该订单的用户信息。

sql：

```java
SELECT * FROM `order` o, `user` u WHERE o.user_id = u.id;
```

多表查询涉及到重名的字段，可以通过sql中的别名解决：

    -- 需求：查询订单信息，关联查询购买该**订单**的用户信息。

```java
SELECT
	o.id order_id,
	o.create_time create_time,
	o.user_id user_id,
	u.username username,
	u.PASSWORD PASSWORD 
FROM
	`order` o,
	`user` u 
WHERE
	o.user_id = u.id
```

    -- 需求：查询订单信息，关联查询购买该**订单**的用户信息。

```java
SELECT 
o.id order_id,
o.create_time create_time,
o.user_id  user_id,
u.username username,
u.`password` `password`
FROM 
`order` o
LEFT JOIN `user`  u
ON o.user_id = u.id
```

查询出正确且合适的结果集后，就可以进行映射的配置了：

User类。用户信息

```java
public class User {
    private Integer id;
    private String username;
    private String password;
		//getter setter
}
```

Order类。订单

```java
public class Order {
    private Integer id;
    private Date createTime;
    private Integer userId;
    //private User user;//后加 代表订单所属用户
		//getter setter
}
```

```java
//  在多对一的时候，我们通常将一的一方作为多的一方的属性
//  这样是为了保证下方的List集合的泛型
创建OderMapper接口和OrderMapper.xml

public interface OrderMapper {
    List<Order> findOrdersWithUser();
}
//  这里泛型定义成Order是因为我们将User的相关信息定义成了Order类的属性。
//  在多对一的时候，我们通常将一的一方作为多的一方的属性
<resultMap id="findOrdersWithUser" type="com.whitecamellia.entity.Order" autoMapping="true">
        <id column="order_id" property="id"/>
        <result column="create_time" property="createTime"/>
        <result column="user_id" property="userId"/>
        <association property="user" javaType="User" autoMapping="true">
            <id column="user_id" property="id"/>
            <result column="username" property="username"/>
            <result column="password" property="password"/>
        </association>
 
    </resultMap>
 
    <select id="findOrdersWithUser" resultMap="findOrdersWithUser">
        SELECT o.id          order_id,
               o.create_time create_time,
               o.user_id     user_id,
               u.username    username,
               u.`password`  `password`
        FROM `order` o
                 LEFT JOIN `user` u
                           ON o.user_id = u.id
    </select>
```

`<association>`代表单一的关联，在多对一. 或. 一对一的关系中使用，注意需要指定javaType属性。

测试类：

```java
 @Autowired
 private OrderMapper orderMapper; 
@Test
    void findOrdersWithUser() {
        List<Order> ordersWithUser = orderMapper.findOrdersWithUser();
        for (Order order : ordersWithUser) {
            System.out.println(order);
        }
    }
```

注意：

我们想偷个懒，标注红线的地方的映射我们想省略，

mybatis.configuration.map-underscore-to-camel-case=true
此外：我们还有另外一种做法：这里我们需要引入一个新的概念DTO

数据传输对象（DTO）(Data Transfer Object)，是一种设计模式之间传输数据的软件应用系统。数据传输目标往往是数据访问对象从数据库中检索数据。数据传输对象与数据交互对象或数据访问对象之间的差异是一个以不具有任何行为除了存储和检索的数据（访问和存取器）。

新建包dto，并创建 OrderAndUserDTO dto

```java
public class OrderAndUserDTO {
    private Integer orderId;
    private Date createTime;
    private Integer userId;
    private String username;
    private String password;
   // getter && sertter..
}
```

在接口OrderMapper添加新方法

```java
public interface OrderAndUserDtoMapper {
    List<OrderAndUserDTO> findOrderAndUser();
}
```

OrderMapper.xml中增加如下配置

```java
<resultMap id="findOrderAndUser" type="com.whitecamellia.dto.OrderAndUserDto" autoMapping="true">
        <id column="order_id" property="orderId"/>
    </resultMap>
    <select id="findOrderAndUser" resultMap="findOrderAndUser">
        SELECT o.id          order_id,
               o.create_time create_time,
               o.user_id     user_id,
               u.username    username,
               u.`password`  `password`
        FROM `order` o
                 LEFT JOIN `user` u
                           ON o.user_id = u.id
    </select>
```

测试

```java
   @Autowired
    private OrderMapper orderMapper;
 
@Test
    void findOrderAndUser() {
        List<OrderAndUserDto> ordersWithUser = orderMapper.findOrderAndUser();
        for (OrderAndUserDto orderAndUserDto : ordersWithUser) {
            System.out.println(orderAndUserDto);
        }
    }
```

需求二
需求：查询订单信息，关联查询它的订单明细信息。

sql：

SELECT * FROM `order` o,order_item oi WHERE o.id = oi.order_id

整理之后的sql语句：

```java
SELECT
	o.id  order_id,
	o.create_time create_time,
	o.user_id user_id,
	oi.id order_item_id,
	oi.item_id item_id,
	oi.num num
FROM
	`order` o,
	order_item oi
WHERE 
	o.id = oi.order_id
```

Order类

```java
public class Order {
    private Integer id;
    private Date createTime;
    private Integer userId;
    private User user; // 代表订单所属用户
    private List<OrderItem> orderItems;//代表订单明细信息
    //getter setter toString
}
```

OrderItem 类

```java
public class OrderItem {
    private Integer id;
    private Integer orderId;
    private Integer itemId;
    private Integer num;
    // getter&&setter&& toString
}
```

```java
//lombok 为我们提供getter&&setter&&toString
OrderMapper接口添加新方法

public interface OrderMapper {
	....
   List<Order> findOrdersWithOrderItems();
  
}
```

OrderMapper.xml映射文件配置

```java
<resultMap id="OrdersWithOrderItemsMap" type="order" autoMapping="true">
        <id column="order_id" property="id"/>
        <result column="create_time" property="createTime"/>
        <result column="user_id" property="userId"/>
        <collection property="orderItems" ofType="OrderItem" autoMapping="true">
            <id column="order_item_id" property="id"/>
            <result column="order_id" property="orderId"/>
            <result column="item_id" property="itemId"/>
            <result column="num" property="num"/>
        </collection>
 
 
    </resultMap>
 
    <select id="findOrdersWithOrderItems" resultMap="OrdersWithOrderItemsMap">
        SELECT o.id          order_id,
               o.create_time create_time,
               o.user_id     user_id,
               oi.id         order_item_id,
               oi.item_id    item_id,
               oi.num        num
        FROM `order` o,
             order_item oi
        WHERE o.id = oi.order_id
    </select>
```

测试：

```java
 @Test
    void findOrdersWithOrderItems() {
        List<Order> ordersWithOrderItems = orderMapper.findOrdersWithOrderItems();
        for (Order ordersWithOrderItem : ordersWithOrderItems) {
            System.out.println(ordersWithOrderItem);
      }
```

`<collection>`代表集合的关联，在一对多的关系中使用，注意需要通过ofType属性指定集合泛型的类型。

dto写法：

创建 OrdersAndOrderItemsDto 类

```java
@Data
public class OrdersAndOrderItemsDto {
    private Integer orderId;
    private Date createTime;
    private Integer userId;
    private Integer orderItemId;
    private Integer itemId;
    private Integer num;
 
}
```

OrderMapper.xml文件配置

```java
<resultMap id="OrdersAndOrderItemsMap" type="OrdersAndOrderItemsDto" autoMapping="true">
        <id column="order_id" property="orderId"/>
    </resultMap>
 
    <select id="findOrdersAndOrderItems" resultMap="OrdersAndOrderItemsMap">
        SELECT o.id          order_id,
               o.create_time create_time,
               o.user_id     user_id,
               oi.id         order_item_id,
               oi.item_id    item_id,
               oi.num        num
        FROM `order` o,
             order_item oi
        WHERE o.id = oi.order_id
    </select>
```

测试

```java
List<OrdersAndOrderItemsDto> ordersAndOrderItems = mapper.findOrdersAndOrderItems();
        for (OrdersAndOrderItemsDto ordersAndOrderItem : ordersAndOrderItems) {
        System.out.println(ordersAndOrderItem);
    }
```

## 7. 查询优化

7.1 延迟加载
什么是延迟加载
根据主表信息去关联查询从表信息时，如果需要从表信息，再去数据库进行查询，如果不需要，则使用代理对象。

延迟加载就是懒加载，也就是按需加载。

Mybatis中的association标签和collection标签具有延迟加载的功能。

需求：
查询车辆信息，按需加载用户信息

实操：
PersonMapper接口中定义方法

```java
public interface PersonMapper {
   Person findById(Integer id);
}
```

CarMapper接口中定义方法

```java
public interface CarMapper {
    Car findById(Integer id);
}
```

定义车的实体/dto

```java
public class Car {
    private Integer id;
    private String name;
    private Integer age;
    private Integer pId;
    private Person person;
    .....
}
```

在PersonMapper.xml中编写一个statement去查询人的信息：

```java
<select id="findById" resultType="com.whitecamellia.entity.Person">
        select * from person  where id = #{id}
   </select>
```

在CarMapper.xml中编写一个statement去查询车的信息：

```java
<resultMap id="carMapper" type="com.whitecamellia.entity.Car" autoMapping="true">
        <id property="id" column="id"/>
        <!--        <result column="name" property="name"/>-->
        <!--        <result column="age" property="age"/>-->
        <!--        <result column="p_id" property="pId"/>-->
        <association property="person" select="com.whitecamellia.mapper.PersonMapper.findById"
                     column="p_id" autoMapping="true">
        </association>
    </resultMap>
 
    <select id="findCarById" resultMap="carMapper">
        select *
        from car
        where id = #{id}
    </select>
```

测试

```java
@Autowired
private CarMapper carMapper;
@Test
    void findCarById() {
        Car car = carMapper.findCarById(1);
        System.out.println(car.getName());
    }//查询车辆指定信息
```

查看结果：

当我们查询Car表name信息，会发现Person的sql语句也会被执行

开启延迟加载

application.properties中配置

开启延迟加载

```java
mybatis.configuration.lazy-loading-enabled=true
```

开启懒加载 设置false那么 会按需加载 3.4.1以下版本模式是true，需要手动修改为false-->

```java
mybatis.configuration.aggressive-lazy-loading=false
```

查看结果：

当我们查询Car表信息，Person的sql语句就不会被查询

只有当我们按需查询Person数据信息时，Perosn的sql语句才会执行。比如我们查询Person的信息。

```java
@Autowired
private CarMapper carMapper;
@Test
    void findCarById() {
        Car car = carMapper.findCarById(1);
        System.out.println(car.getPerson().getName());
    }//查询车辆指定信息
```

7.2 缓存
缓存简介
Mybatis包含一个非常强大的查询缓存特性，它可以非常方便配置和定制。缓存可以极大的提升查询效率。

例如：每个用户登入的页面的菜单功能选项都是固定的，点击每个选项都需要去数据库中查询数据，那么对于所有用户来说，数据都是一样的，那么我们就没必要每次点击菜单功能选项都去查询数据库，那样效率会很低，用户很多的时候，数据库服务器负担就会很严重。

所以我们就需要用到缓存。

Mybatis的查询分为：

一级缓存指的是sqlsession级别的。(本地缓存)

一级缓存只会在同一个sqlsession之间共享，多个sqlsession之间的一级缓存是互相独立的，默认一直开启，没法关闭。

与数据库同一次会话期间查询到的数据会放在本地缓存。以后如果需要获取相同数据，直接从缓存中拿，没必要再去查数据库。

二级缓存指的是mapper（namespace）级别的。(全局缓存)

二级缓存只会在同一个namespace下的mapper映射文件之间共享。

一级缓存
Mybatis默认支持一级缓存。

第一次发起查询用户id为1的用户信息，先去找缓存中是否有id为1的用户信息，如果没有，从数据库查询用户信息。得到用户信息，将用户信息存储到一级缓存中。

如果sqlSession去执行commit操作（执行插入、更新、删除），清空SqlSession中的一级缓存，这样做的目的为了让缓存中存储的是最新的信息，避免脏读。

第二次发起查询用户id为1的用户信息，先去找缓存中是否有id为1的用户信息，缓存中有，直接从缓存中获取用户信息。

```java
@Autowired
 private SqlSessionFactory sqlSessionFactory;
 
 @Test
    void testCache1() {
        SqlSession sqlSession = sqlSessionFactory.openSession(true);
        PersonMapper mapper = sqlSession.getMapper(PersonMapper.class);
        Person person1 = mapper.findById(1);
        System.out.println(person1);
        // mapper.deleteByIds(new int[]{1});
        personMapper.deleteByIds(new int[]{1});
        Person person2 = mapper.findById(1);
        System.out.println(person2);
 
    }
 
    @Test
    void testCache2() {
        SqlSession sqlSession = sqlSessionFactory.openSession(true);
        PersonMapper mapper = sqlSession.getMapper(PersonMapper.class);
        Person person1 = mapper.findById(1);
        System.out.println(person1);
    }
 
    @Test
    void testCache() {
        testCache1();
        testCache2();
    }
```

结果：

使用缓存：

testCache1()

未使用缓存：

testCache()

搞点事情：

查询结果：

一级缓存失效：
sqlSession不同：相同数据在sqlSession域中会被共享，不同sqlSession域之间数据不会共享

sqlSession相同：查询条件不同，（一级缓存中还没有这个要查询的数据）

sqlSession相同：两次查询之间，增加了 CRUD操作（有可能CRUD会影响当前数据）

sqlSession相同：手动清除了一级缓存数据，（缓存清空）

代码：

```java
 @Autowired
 private SqlSessionFactory sqlSessionFactory;
 
@Test
public void test4() throws IOException {
  
    SqlSession sqlSession = sqlSessionFactory.openSession(true);//true自动提交
    SqlSession sqlSession1 = sqlSessionFactory.openSession(true);//true自动提交

  	//1.分别获取不同的sqlSession对象
    OrderMapper mapper = sqlSession.getMapper(OrderMapper.class);
    Order order1 = mapper.findByIdWithUserLazy(1);
    System.out.println(order1.getUser());//获取User的用户信息
 
    OrderMapper mapper2 = sqlSession1.getMapper(OrderMapper.class);
    Order order2 = mapper.findByIdWithUserLazy(1);
    System.out.println(order2.getUser());//获取User的用户信息
  
  
   //2.
    OrderMapper mapper = sqlSession.getMapper(OrderMapper.class);
    Order order1 = mapper.findByIdWithUserLazy(1);//sql语句相同，但是 查询条件不同，
    Order order2 = mapper.findByIdWithUserLazy(3);//域中没有id为3的 用户信息
    System.out.println(order1.getUser());//获取User的用户信息
    System.out.println(order2.getUser());//获取User的用户信息
  
    //3.
  	OrderMapper mapper = sqlSession.getMapper(OrderMapper.class);
    Order order1 = mapper.findByIdWithUserLazy(1);//执行操作是一样的
    System.out.println(order1.getUser());//获取User的用户信息
 
    //执行修改操作
    //mapper.updateOrdersWithUser(1);
 
    Order order2 = mapper.findByIdWithUserLazy(1);//执行操作是一样的
    System.out.println(order2.getUser());//获取User的用户信息 就是修改之后的
  
    //4
   OrderMapper mapper = sqlSession.getMapper(OrderMapper.class);
	 Order order1 = mapper.findByIdWithUserLazy(1);//执行操作是一样的
   System.out.println(order1.getUser());//获取User的用户信息
 
   sqlSession.clearCache();//清空一级缓存
 
   Order order2 = mapper.findByIdWithUserLazy(1);//执行操作是一样的
   System.out.println(order2.getUser());//获取User的用户信息
 
}
```

二级缓存
二级缓存指的是mapper（namespace）级别的。一个namespace对应一个二级缓存

工作机制：
一个会话，查询一条数据，这个数据会被放在当前会话的一级缓存中

如果会话关闭，一级缓存中的数据会被保存到二级缓存中，新的会话查询信息，可以参考二级缓存

sqlSession--->

不同namespace查出的数据会放在自己的对应缓存中(map)

使用：
开启全局二级缓存配置：

<!--默认是开启的-->

mybatis.configuration.cache-enabled=true
开启mapper级别的缓存开关，在对应的OrderMapper.xml中添加缓存开关

`<cache></cache>`

<!-- 里面的参数属性 作为了解，如果什么都不配置，就是默认如下配置-->

<!-- <cache eviction="FIFO" flushInterval="60000" readOnly="false" size="1024"></cache> -->

<!--
eviction:缓存的回收策略：
    • LRU – 最近最少使用的：移除最长时间不被使用的对象。
    • FIFO – 先进先出：按对象进入缓存的顺序来移除它们。
    • SOFT – 软引用：移除基于垃圾回收器状态和软引用规则的对象。
    • WEAK – 弱引用：更积极地移除基于垃圾收集器状态和弱引用规则的对象。
    • 默认的是 LRU。
flushInterval：缓存刷新间隔
    缓存多长时间清空一次，默认不清空，设置一个毫秒值
readOnly:是否只读：
    true：只读；mybatis认为所有从缓存中获取数据的操作都是只读操作，不会修改数据。
             mybatis为了加快获取速度，直接就会将数据在缓存中的引用交给用户。不安全，速度快
    false：非只读：mybatis觉得获取的数据可能会被修改。
            mybatis会利用序列化&反序列的技术克隆一份新的数据给你。安全，速度慢
size：缓存存放多少元素；
-->

注意：测试二级缓存时Mapper要使用注入形式：

Person person = PersonMapper.findById（3）;
Pojo类需要序列化，并定义UID

不是说因为学习了缓存我们才实现序列化，是因为POJO类都是实现数据持久化交互的

```java
public Person implements Serializable {
    private static final long serialVersionUID = 4829831994525772316L;
}
```

测试：我们把二级缓存配置注释。测试

```java
@Test
    void test() {
        testCache1();
        testCache2();
    }
 
    @Test
    void testCache1() {
        Person person = personMapper.findById(1);
        System.out.println(person);
    }
 
    @Test
    void testCache2() {
        Person person = personMapper.findById(1);
        System.out.println(person);
    }
```

结果：会发现我们当关闭一个sqlSession时，另一个sqlSession就需要在此请求sql语句，发送2次请求

我们把二级缓存配置 激活，测试

会发现提示缓存命中率。Cache Hit Ratio。

证明我们发送二次请求的时候，是从二级缓存中拿的数据，并没有再次发送sql

注意：只有会话关闭了，该sqlSession数据才会跑到二级缓存中。

## 8 Mybatis执行流程

Configration会去找全局配置文件mybatis.xml，然后sesssion工厂去找sqlsession。

我们写servlet目前是为了接收前端请求和连接数据库，访问数据，

那么servlet和数据库的连接也算是请求数据和响应数据。

Sqlsession就是myBatis中最核心的了。它去加载mappedStatment。然后去执行TransAction。
