-- CreateTable
CREATE TABLE `tbl_class` (
    `c_seq` INTEGER NOT NULL AUTO_INCREMENT,
    `c_name` VARCHAR(50) NOT NULL,
    `c_sdate` VARCHAR(15) NOT NULL,
    `c_edate` VARCHAR(15) NOT NULL,
    `c_stime` VARCHAR(15) NOT NULL,
    `c_etime` VARCHAR(15) NOT NULL,
    `c_tcode` VARCHAR(10) NOT NULL,
    `c_ccode` VARCHAR(10) NOT NULL,
    `c_color` VARCHAR(20) NULL,

    INDEX `c_ccode`(`c_ccode`),
    INDEX `c_tcode`(`c_tcode`),
    PRIMARY KEY (`c_seq`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `tbl_company` (
    `c_code` VARCHAR(10) NOT NULL,
    `c_name` VARCHAR(10) NOT NULL,
    `c_addr` VARCHAR(125) NULL,
    `c_tel` VARCHAR(15) NULL,
    `c_uid` VARCHAR(20) NULL,

    INDEX `c_uid`(`c_uid`),
    PRIMARY KEY (`c_code`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `tbl_gallerys` (
    `g_id` VARCHAR(125) NOT NULL,
    `g_date` VARCHAR(10) NOT NULL,
    `g_time` VARCHAR(10) NOT NULL,
    `g_author` VARCHAR(20) NOT NULL,
    `g_subject` VARCHAR(20) NOT NULL,
    `g_content` VARCHAR(100) NOT NULL,
    `g_origin_image` VARCHAR(255) NOT NULL,
    `g_up_image` VARCHAR(255) NOT NULL,

    PRIMARY KEY (`g_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `tbl_minfo` (
    `i_seq` INTEGER NOT NULL AUTO_INCREMENT,
    `i_title` VARCHAR(50) NOT NULL,
    `i_price` INTEGER NOT NULL,
    `i_count` INTEGER NOT NULL,
    `i_ccode` VARCHAR(10) NOT NULL,

    INDEX `i_ccode`(`i_ccode`),
    PRIMARY KEY (`i_seq`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `tbl_notice` (
    `n_seq` VARCHAR(255) NOT NULL,
    `n_title` VARCHAR(125) NOT NULL,
    `n_content` VARCHAR(255) NOT NULL,
    `n_ccode` VARCHAR(10) NOT NULL,
    `n_uid` VARCHAR(20) NOT NULL,
    `n_date` VARCHAR(10) NOT NULL,
    `n_time` VARCHAR(10) NOT NULL,

    INDEX `n_ccode`(`n_ccode`),
    INDEX `n_uid`(`n_uid`),
    PRIMARY KEY (`n_seq`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `tbl_role` (
    `r_uid` VARCHAR(20) NOT NULL,
    `r_role` VARCHAR(20) NOT NULL,

    INDEX `r_uid`(`r_uid`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `tbl_schedule` (
    `s_seq` INTEGER NOT NULL AUTO_INCREMENT,
    `s_title` VARCHAR(50) NOT NULL,
    `s_content` VARCHAR(125) NULL,
    `s_sdate` VARCHAR(15) NULL,
    `s_edate` VARCHAR(15) NULL,
    `s_ccode` VARCHAR(15) NULL,
    `s_color` VARCHAR(20) NULL,

    PRIMARY KEY (`s_seq`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `tbl_teacher` (
    `t_code` VARCHAR(10) NOT NULL,
    `t_name` VARCHAR(10) NOT NULL,
    `t_tel` VARCHAR(15) NOT NULL,
    `t_ccode` VARCHAR(10) NOT NULL,

    INDEX `t_ccode`(`t_ccode`),
    PRIMARY KEY (`t_code`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `tbl_user` (
    `u_id` VARCHAR(20) NOT NULL,
    `u_password` VARCHAR(125) NOT NULL,
    `u_name` VARCHAR(10) NOT NULL,
    `u_tel` VARCHAR(15) NOT NULL,
    `u_comp` VARCHAR(10) NULL,

    PRIMARY KEY (`u_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `tbl_user_comp` (
    `us_uid` VARCHAR(20) NOT NULL,
    `us_ccode` VARCHAR(10) NOT NULL,
    `us_uname` VARCHAR(10) NULL,
    `us_utel` VARCHAR(15) NULL,
    `us_cname` VARCHAR(10) NULL,
    `us_date` VARCHAR(15) NULL,

    PRIMARY KEY (`us_uid`, `us_ccode`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `tbl_user_minfo` (
    `r_uid` VARCHAR(20) NOT NULL,
    `r_iseq` INTEGER NOT NULL,
    `r_icount` INTEGER NOT NULL,
    `r_sdate` VARCHAR(10) NOT NULL,
    `r_edate` VARCHAR(10) NOT NULL,

    PRIMARY KEY (`r_iseq`, `r_uid`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `tbl_class` ADD CONSTRAINT `tbl_class_ibfk_1` FOREIGN KEY (`c_tcode`) REFERENCES `tbl_teacher`(`t_code`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `tbl_class` ADD CONSTRAINT `tbl_class_ibfk_2` FOREIGN KEY (`c_ccode`) REFERENCES `tbl_company`(`c_code`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `tbl_company` ADD CONSTRAINT `tbl_company_ibfk_1` FOREIGN KEY (`c_uid`) REFERENCES `tbl_user`(`u_id`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `tbl_minfo` ADD CONSTRAINT `tbl_minfo_ibfk_1` FOREIGN KEY (`i_ccode`) REFERENCES `tbl_company`(`c_code`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `tbl_notice` ADD CONSTRAINT `tbl_notice_ibfk_1` FOREIGN KEY (`n_ccode`) REFERENCES `tbl_company`(`c_code`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `tbl_notice` ADD CONSTRAINT `tbl_notice_ibfk_2` FOREIGN KEY (`n_uid`) REFERENCES `tbl_user`(`u_id`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `tbl_role` ADD CONSTRAINT `tbl_role_ibfk_1` FOREIGN KEY (`r_uid`) REFERENCES `tbl_user`(`u_id`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `tbl_teacher` ADD CONSTRAINT `tbl_teacher_ibfk_1` FOREIGN KEY (`t_ccode`) REFERENCES `tbl_company`(`c_code`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `tbl_user_comp` ADD CONSTRAINT `tbl_user_comp_us_uid_fkey` FOREIGN KEY (`us_uid`) REFERENCES `tbl_user`(`u_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `tbl_user_minfo` ADD CONSTRAINT `tbl_user_minfo_ibfk_1` FOREIGN KEY (`r_iseq`) REFERENCES `tbl_minfo`(`i_seq`) ON DELETE CASCADE ON UPDATE NO ACTION;
