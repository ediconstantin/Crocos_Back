INSERT INTO `categories` (`id`, `name`, `description`, `photo`) VALUES
(1, 'Programare Orientata Obiect', 'Materia POO', NULL),
(2, 'Retele de calculatoare', 'Materia retele de calculatoare', NULL);

INSERT INTO `series` (`id`, `name`) VALUES
(1, 'A');

INSERT INTO `groups` (`id`, `name`, `series_id`) VALUES
(1, '1066', 1);

INSERT INTO `users` (`id`, `token`, `firstname`, `lastname`, `email`, `photo`, `isProf`, `isAdmin`, `isActive`, `group_id`) VALUES
(1, NULL, 'ALEXANDRU STEFAN', 'BISAG', 'bisagalexandru16@stud.ase.ro', NULL, 1, 1, 0, 1);

INSERT INTO `questions` (`id`, `question`, `ans1`, `ans2`, `ans3`, `ans4`, `correct`, `feedback`, `photo`, `multiple`, `open`, `duration`, `user_id`, `category_id`) VALUES
(1, 'Ce este POO?', 'E POO nu', 'Nimic', 'nush', 'o materie blana', 'ans4', 'Da. e o materie blanao.', 'asd', 0, 0, 25, 14, 1),
(2, 'Ce este RC?', 'SO de anul 3', 'vrajeala', 'este', 'mmnu', 'ans1#ans2', 'De ce nu stii ce e poo?', 'asd', 1, 0, 15, 14, 2);

INSERT INTO `tests` (`id`, `name`, `description`, `duration`, `questionsNumber`, `retries`, `backwards`, `isPublic`, `user_id`, `category_id`) VALUES
(1, 'RC - Capitolul 5', 'tralala', 25, 10, 1, 1, 1, 14, 2),
(2, 'POO - Capitolul 3', 'tralala', 15, 8, 2, 0, 0, 14, 2);

INSERT INTO `test_question` (`question_id`, `test_id`) VALUES
(1, 1),
(2, 2);