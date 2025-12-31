--Users

CREATE TABLE users (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(150) NOT NULL,
  role ENUM('Donor','NGO','Admin') NOT NULL,
  contact_info VARCHAR(255) NOT NULL,
  email VARCHAR(150) UNIQUE,
  password VARCHAR(255),
  status ENUM('Approved','Pending') DEFAULT 'Approved',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

 

INSERT INTO users (name, role, contact_info) VALUES
('Helping Hands Trust', 'NGO', 'ngo@mail.com'),
('Steeve', 'Donor', 'steeve@mail.com');

INSERT INTO users (name, role, contact_info, email, password) VALUES
    -> ('Navdeep', 'Donor', '1234567890', 'navdeep131104@gmail.com', '098765');


--Donations

CREATE TABLE donations (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    ngo_id BIGINT NOT NULL,
    donation_type ENUM('Food', 'Funds', 'Clothes', 'Medicine', 'Other') NOT NULL,
    quantity_or_amount DECIMAL(10,2) NOT NULL CHECK (quantity_or_amount > 0),
    location VARCHAR(255) NOT NULL,
    pickup_date_time DATETIME NOT NULL,
    status ENUM('Pending', 'Confirmed', 'Completed', 'Cancelled') DEFAULT 'Pending',
    images VARCHAR(500) NULL,
    priority ENUM('Normal', 'Urgent') DEFAULT 'Normal',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_donation_ngo
        FOREIGN KEY (ngo_id) REFERENCES users(id)
        ON DELETE CASCADE
        ON UPDATE CASCADE
);

INSERT INTO donations
(ngo_id, donation_type, quantity_or_amount, location, pickup_date_time)
VALUES
(1, 'Food', 50, 'Mumbai Andheri', '2025-02-01 10:00:00');


--Contributions

CREATE TABLE contributions (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    donation_id BIGINT NOT NULL,
    donor_id BIGINT NOT NULL,
    contribution_quantity DECIMAL(10,2) NOT NULL CHECK (contribution_quantity > 0),
    pickup_date_time DATETIME NULL,
    notes TEXT NULL,
    status ENUM('Scheduled', 'PickedUp', 'Cancelled') DEFAULT 'Scheduled',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_contribution_donation
        FOREIGN KEY (donation_id) REFERENCES donations(id)
        ON DELETE CASCADE,

    CONSTRAINT fk_contribution_donor
        FOREIGN KEY (donor_id) REFERENCES users(id)
        ON DELETE CASCADE
);

INSERT INTO contributions
(donation_id, donor_id, contribution_quantity, pickup_date_time)
VALUES
(1, 2, 20, '2025-02-01 09:30:00');




