---
up:
  - "[[Home]]"
created: 2020-06-01
tags:
  - map
---
This is where I keep tabs on some of the sources I have encountered. 
What "sources" should you track? 
How about books and movies?

> [!Book]- ### Books
> ```dataview
> TABLE WITHOUT ID
>  year as "Year",
>  file.link as Book
>  
> FROM "Atlas/Notes/Sources" and -#x/readme
> 
> WHERE type = [[Book]]
> 
> SORT year asc
> ```

> [!video]- ### Movies
> ```dataview
> TABLE WITHOUT ID
>  year as "Year",
>  file.link as Movie
>  
> FROM "Atlas/Notes/Sources" and -#x/readme
> 
> WHERE type = [[Movie]]
> 
> SORT year asc
> ```

For the Fall 2023 Ideaverse, I am playing around with a property field called `type`. It allows me a nice way to create a few passive maps for different types of sources. Here's what I have so far, feel free to make more:

- [[Book]] | [[Game]] | [[Movie]] | [[Paper]] | [[Song]] | [[Speech]]

For more ideas, check out the tags pane. Find "source" and twirl it down. The sources I have decided to include tracking over the years include: *books, movies, songs, research papers, plays, paintings, quotes, videos, speeches, poems, tweets, articles, and newsletters*. 

> [!Script]- ## ALL SOURCES
> This is a simple data view pulling anything from the **Sources** folder.
> 
> ```dataview
> TABLE WITHOUT ID
>  year as "Year",
>  type as Type,
>  file.link as Source
>  
> FROM "Atlas/Notes/Sources" and -#x/readme 
> 
> SORT year asc
> ```

Not included here, but in my personal vault, I enjoy checking out the comprehensive [[Source MOC]] and perusing my [[Bookshelf 📚]]. And to honor the old ones, I also keep a [[Commonplace Book]] based on tags.

> [!NOTE]+ This is a sanitized version of my actual note. 
> - Content and links have been removed.








