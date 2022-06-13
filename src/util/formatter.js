export const BlogFormat = ({
  title,
  description,
  author,
  categories,
  tags,
  image,
  date,
}) => ({
  title: title,
  description: description,
  author: author,
  category: categories,
  tags: tags,
  image: image,
  published_time: date,
});